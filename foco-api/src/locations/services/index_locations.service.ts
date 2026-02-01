import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MunicipalitiesEntity } from '@app/locations/entities/municipalities.entity';
import { ProvincesEntity } from '@app/locations/entities/provinces.entity';
import { ErrorManager } from '@app/common/utils/error-manager';
import { ICabaCommune, ICoordinates, IMunicipalities, IProvinces } from '@app/locations/interfaces';
import { CabaCommunesEntity } from '@app/locations/entities/caba_communes.entity';
import * as cabaData from '@app/common/data/caba_commune.json';
import { In } from 'typeorm';

@Injectable()
export class IndexLocationsService {
  private municipalities: Array<IMunicipalities>;
  private provinces: Array<IProvinces>;
  public localidadesCaba: Array<ICabaCommune>;
  private objectMapProvince = new Map<string, ProvincesEntity>();

  constructor(
    @InjectRepository(ProvincesEntity)
    private readonly provincesRepository: Repository<ProvincesEntity>,
    @InjectRepository(MunicipalitiesEntity)
    private readonly municipalitiesRepository: Repository<MunicipalitiesEntity>,
    @InjectRepository(CabaCommunesEntity)
    private readonly cabaCommunesRepository: Repository<CabaCommunesEntity>,
  ) {}

  async getProvincesAndMunicipalities() {
    try {
      return await axios.get(`https://infra.datos.gob.ar/georef/municipios.json`);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  private mapProvinces(data: any[]): IProvinces[] {
    return data.map((item) => ({
      province_id: item.provincia.id,
      name: item.provincia.nombre,
    }));
  }

  private mapMunicipalities(municipalities: any[]): IMunicipalities[] {
    return municipalities.map((item) => ({
      municipality_id: item.id,
      name: item.nombre,
      full_name: item.nombre_completo,
      category: item.categoria,
      coordinates: item.centroide,
      province: {
        province_id: item.provincia.id,
        name: item.provincia.nombre,
      },
    }));
  }

  private removeDuplicates<T>(array: T[]): T[] {
    const stringArray = array.map((item) => JSON.stringify(item));
    const uniqueArray = Array.from(new Set(stringArray));
    return uniqueArray.map((item) => JSON.parse(item));
  }

  async deleteAndMapProvincesAndMunicipalities(): Promise<void> {
    const { data } = await this.getProvincesAndMunicipalities();
    // Procesar provincias y municipios eliminando duplicados
    this.provinces = this.removeDuplicates(this.mapProvinces(data.municipios));
    this.municipalities = this.removeDuplicates(this.mapMunicipalities(data.municipios));
  }

  public convertToGeometryPoint(coordinates: ICoordinates): object {
    return {
      type: 'Point',
      coordinates: [coordinates.lon, coordinates.lat],
    };
  }

  private async saveProvinces() {
    for (const provinciaData of this.provinces) {
      const province = await this.provincesRepository.save({
        province_id: provinciaData.province_id,
        name: provinciaData.name,
      });
      this.objectMapProvince.set(province.province_id, province);
    }
  }

  private async saveMunicipalities() {
    const municipalities = this.municipalities.map((item: IMunicipalities) => {
      const province = this.objectMapProvince.get(item.province.province_id);

      if (!province) {
        throw new Error(`No se encontró la provincia para el municipio ${item.name}`);
      }

      return {
        municipality_id: String(item.municipality_id),
        name: item.name,
        full_name: item.full_name,
        category: item.category,
        coordinates: this.convertToGeometryPoint(item.coordinates),
        province,
        isCommune: false,
      };
    });
    await this.municipalitiesRepository.save(municipalities);
  }

  public async createProvincesAndMunicipalities(): Promise<void> {
    const provincesResponse = await this.provincesRepository.find();

    const municipalitiesResponse = await this.municipalitiesRepository.find();

    const communeCabaResponse = await this.cabaCommunesRepository.find();

    // Si ya existen los datos cargados en la base de datos
    if (provincesResponse.length > 0 && municipalitiesResponse.length > 0 && communeCabaResponse.length > 0) {
      console.log('✅ Provincias, municipios y comunas de caba existentes');

      //Una vez insertado los municipios, marcamos las comunas de caba como true
      await this.municipalitiesRepository.update({ province: '02' }, { isCommune: true });

      await this.createCabaCommunes();

      return null;
    }

    //Si no hay datos de provincias, municipalidades y comunas en la db

    //Procesardor de datos de municipios y provincias
    await this.deleteAndMapProvincesAndMunicipalities();

    await this.saveProvinces();

    await this.saveMunicipalities();

    //Una vez insertado los municipios, marcamos las comunas de caba como true
    await this.municipalitiesRepository.update({ province: '02' }, { isCommune: true });

    await this.createCabaCommunes();

    return null;
  }

  private async createCabaCommunes(): Promise<void> {
    // 2. Verificar si ya existen datos
    const existingLocalidades = await this.cabaCommunesRepository.count();
    if (existingLocalidades > 0) {
      console.log('✅ Localidades de CABA ya existen');
      return;
    }

    const cabaIds = cabaData.communes.map((c) => c.municipality_id);

    const existingCommunes = await this.municipalitiesRepository.find({
      where: { municipality_id: In(cabaIds) },
    });

    const foundIds = existingCommunes.map((m) => m.municipality_id);

    const localidadesToSave = [];

    cabaData.communes.forEach((commune) => {
      if (foundIds.includes(commune.municipality_id)) {
        commune.communes.forEach((localidadNombre: string) => {
          localidadesToSave.push({
            name: localidadNombre,
            municipality_id: commune.municipality_id,
          });
        });
      }
    });

    if (localidadesToSave.length > 0) {
      await this.cabaCommunesRepository.save(localidadesToSave);
    }
  }
}
