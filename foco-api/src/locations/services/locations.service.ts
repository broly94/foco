import { ILike, Like, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvincesEntity } from '@app/locations/entities/provinces.entity';
import { MunicipalitiesEntity } from '@app/locations/entities/municipalities.entity';
import { ErrorManager } from '@app/common/utils/error-manager';

@Injectable()
export class LocationsService {
  public limit = 5;

  constructor(
    @InjectRepository(ProvincesEntity)
    private readonly provincesRepository: Repository<ProvincesEntity>,
    @InjectRepository(MunicipalitiesEntity)
    private readonly municipalitiesRepository: Repository<MunicipalitiesEntity>,
  ) {}

  public async getLocationsByText(text: string): Promise<any> {
    if (!text || text.trim() === '') {
      throw ErrorManager.createSignatureError('Invalid search');
    }

    const provinces = await this.provincesRepository.find({
      where: { name: ILike(`%${text}%`) },
      select: ['id', 'province_id', 'name', 'country'],
      take: 5,
    });

    if (provinces.length === 0) {
      throw new HttpException('No provinces found', HttpStatus.NOT_FOUND);
    }

    const municipalities = await this.municipalitiesRepository
      .createQueryBuilder('municipalities')
      .leftJoinAndSelect('municipalities.province', 'province')
      .where('municipalities.name ILIKE :by', { by: `%${text}%` })
      .orWhere('province.name ILIKE :by', { by: `%${text}%` })
      .select([
        'province.id',
        'province.province_id',
        'province.name',
        'province.country',
        'municipalities.id',
        'municipalities.municipality_id',
        'municipalities.name',
        'municipalities.category',
        'municipalities.coordinates',
      ])
      .take(this.limit)
      .getMany();

    return [
      ...provinces.map((prov) => ({ type: 'provinces', ...prov })),
      ...municipalities.map((muni) => ({ type: 'municipalities', ...muni })),
    ];
  }

  public async getMunicipalitiesByProvince(province_id: string): Promise<any> {
    try {
      const province = await this.provincesRepository.findOne({ where: { province_id } });

      if (!province) {
        throw ErrorManager.createSignatureError('Province not found');
      }

      const municipalities = await this.municipalitiesRepository
        .createQueryBuilder('municipalities')
        .where('municipalities.province = :province', { province: province.province_id })
        .leftJoinAndSelect('municipalities.province', 'province')
        .select([
          'province.province_id',
          'province.name',
          'province.country',
          'municipalities.municipality_id',
          'municipalities.full_name',
          'municipalities.name',
          'municipalities.category',
          'municipalities.coordinates',
        ])
        .getMany();

      if (municipalities.length === 0) {
        throw ErrorManager.createSignatureError('No municipalities found for this province');
      }

      return {
        total: municipalities.length,
        country: province.country,
        province: municipalities[0]?.province,
        data: municipalities.map((mun) => ({
          municipality_id: mun.municipality_id,
          name: mun.name,
          full_name: mun.full_name,
          coordinates: mun.coordinates,
          category: mun.category,
        })),
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getMunicipalitiesByProvinceIdAndText(provinceId: string, text: string): Promise<any> {
    try {
      if (!text || text.trim() === '') {
        throw ErrorManager.createSignatureError('Invalid search term');
      }

      const municipalities = await this.municipalitiesRepository
        .createQueryBuilder('municipalities')
        .leftJoinAndSelect('municipalities.province', 'province')
        .where('municipalities.province = :provinceId', { provinceId })
        .andWhere('municipalities.name ILIKE :text', { text: `%${text}%` })
        .select([
          'province.id',
          'province.province_id',
          'province.name',
          'province.country',
          'municipalities.id',
          'municipalities.municipality_id',
          'municipalities.name',
          'municipalities.category',
          'municipalities.coordinates',
        ])
        .take(this.limit)
        .getMany();

      if (municipalities.length === 0) {
        throw ErrorManager.createSignatureError('No municipalities found for this province with the given text');
      }

      return municipalities;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getProvinces() {
    try {
      return await this.provincesRepository.find({
        select: { id: true, name: true, country: true, municipalities: true, province_id: true },
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // locations.service.ts - mejorar el método existente
  public async findExactLocation(fullText: string): Promise<{
    province: ProvincesEntity | null | string;
    municipality: MunicipalitiesEntity | null;
    matchType: 'exact' | 'partial' | 'not_found';
  }> {
    if (!fullText || fullText.trim() === '') {
      return {
        province: null,
        municipality: null,
        matchType: 'not_found',
      };
    }

    const cleanedText = fullText.trim();

    // PRIMERO: Buscar municipio exacto
    const municipality = await this.municipalitiesRepository
      .createQueryBuilder('municipality')
      .leftJoinAndSelect('municipality.province', 'province')
      .where('municipality.name ILIKE :name', { name: cleanedText })
      .orWhere('municipality.full_name ILIKE :name', { name: cleanedText })
      .getOne();

    if (municipality) {
      return {
        province: municipality.province,
        municipality: municipality,
        matchType: 'exact',
      };
    }

    // SEGUNDO: Buscar provincia exacta
    const province = await this.provincesRepository.findOne({
      where: { name: ILike(cleanedText) },
    });

    if (province) {
      return {
        province: province,
        municipality: null,
        matchType: province.name.toLowerCase() === cleanedText.toLowerCase() ? 'exact' : 'partial',
      };
    }

    // TERCERO: Búsqueda por partes si el texto contiene comas
    if (cleanedText.includes(',')) {
      const parts = cleanedText
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part);

      // Buscar municipio en la primera parte y provincia en la segunda
      if (parts.length >= 2) {
        const municipalityMatch = await this.municipalitiesRepository
          .createQueryBuilder('municipality')
          .leftJoinAndSelect('municipality.province', 'province')
          .where('municipality.name ILIKE :name', { name: `%${parts[0]}%` })
          .orWhere('municipality.full_name ILIKE :name', { name: `%${parts[0]}%` })
          .getOne();

        if (municipalityMatch) {
          return {
            province: municipalityMatch.province,
            municipality: municipalityMatch,
            matchType: 'exact',
          };
        }

        // Buscar provincia en cualquier parte
        for (const part of parts) {
          const provinceMatch = await this.provincesRepository.findOne({
            where: { name: ILike(`%${part}%`) },
          });

          if (provinceMatch) {
            return {
              province: provinceMatch,
              municipality: null,
              matchType: 'partial',
            };
          }
        }
      }
    }

    // CUARTO: Búsqueda parcial como último recurso
    const partialMunicipality = await this.municipalitiesRepository
      .createQueryBuilder('municipality')
      .leftJoinAndSelect('municipality.province', 'province')
      .where('municipality.name ILIKE :text', { text: `%${cleanedText}%` })
      .orWhere('municipality.full_name ILIKE :text', { text: `%${cleanedText}%` })
      .getOne();

    if (partialMunicipality) {
      return {
        province: partialMunicipality.province,
        municipality: partialMunicipality,
        matchType: 'partial',
      };
    }

    const partialProvince = await this.provincesRepository.findOne({
      where: { name: ILike(`%${cleanedText}%`) },
    });

    return {
      province: partialProvince,
      municipality: null,
      matchType: partialProvince ? 'partial' : 'not_found',
    };
  }

  // Generar patrones de búsqueda a partir del texto completo
  private generateSearchPatterns(text: string): Array<{ municipality: string; province: string }> {
    const patterns: Array<{ municipality: string; province: string }> = [];

    // Dividir por comas y limpiar espacios
    const parts = text
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part);

    if (parts.length >= 2) {
      // Patrón: "Municipio, Provincia, País"
      patterns.push({
        municipality: parts[0],
        province: parts[1],
      });

      // Patrón: "Municipio, Provincia"
      if (parts.length >= 2) {
        patterns.push({
          municipality: parts[0],
          province: parts[1],
        });
      }

      // Patrón: "Localidad, Partido, Provincia"
      if (parts.length >= 3) {
        patterns.push({
          municipality: parts[0] + ' ' + parts[1], // Ej: "Florencio Varela"
          province: parts[2],
        });
      }
    }

    // También intentar con el texto completo como municipio
    patterns.push({
      municipality: text,
      province: '',
    });

    return patterns;
  }

  // Intentar encontrar con un patrón específico
  private async tryFindByPattern(pattern: { municipality: string; province: string }): Promise<{
    province: ProvincesEntity | null;
    municipality: MunicipalitiesEntity | null;
  }> {
    let province: ProvincesEntity | null = null;
    let municipality: MunicipalitiesEntity | null = null;

    // Buscar provincia si se especificó
    if (pattern.province) {
      province = await this.provincesRepository.findOne({
        where: { name: ILike(`%${pattern.province}%`) },
      });
    }

    // Buscar municipio
    if (pattern.municipality) {
      const query = this.municipalitiesRepository
        .createQueryBuilder('municipality')
        .leftJoinAndSelect('municipality.province', 'province')
        .where('municipality.name ILIKE :name', { name: `%${pattern.municipality}%` });

      if (province) {
        query.andWhere('province.id = :provinceId', { provinceId: province.id });
      }

      municipality = await query.getOne();
    }

    return { province, municipality };
  }

  // Búsqueda parcial como fallback
  private async tryPartialSearch(text: string): Promise<{
    province: ProvincesEntity | null | string;
    municipality: MunicipalitiesEntity | null;
  }> {
    // Buscar primero como municipio
    let municipality = await this.municipalitiesRepository
      .createQueryBuilder('municipality')
      .leftJoinAndSelect('municipality.province', 'province')
      .where('municipality.name ILIKE :text', { text: `%${text}%` })
      .orWhere('municipality.full_name ILIKE :text', { text: `%${text}%` })
      .getOne();

    // Si encontramos municipio, devolver con su provincia
    if (municipality) {
      return {
        province: municipality.province,
        municipality: municipality,
      };
    }

    // Buscar como provincia
    const province = await this.provincesRepository.findOne({
      where: { name: ILike(`%${text}%`) },
    });

    return {
      province: province,
      municipality: null,
    };
  }

  // Método adicional: Búsqueda inteligente con sugerencias
  public async smartLocationSearch(text: string): Promise<{
    exactMatch: {
      province: ProvincesEntity | null | string;
      municipality: MunicipalitiesEntity | null;
    };
    suggestions: {
      provinces: ProvincesEntity[];
      municipalities: MunicipalitiesEntity[];
    };
  }> {
    const exactMatch = await this.findExactLocation(text);

    // Si no hay match exacto, buscar sugerencias
    let suggestions = { provinces: [], municipalities: [] };
    if (exactMatch.matchType === 'not_found') {
      const cleanedText = text.trim().toLowerCase();

      suggestions.provinces = await this.provincesRepository.find({
        where: { name: ILike(`%${cleanedText}%`) },
        take: 5,
      });

      suggestions.municipalities = await this.municipalitiesRepository
        .createQueryBuilder('municipality')
        .leftJoinAndSelect('municipality.province', 'province')
        .where('municipality.name ILIKE :text', { text: `%${cleanedText}%` })
        .orWhere('municipality.full_name ILIKE :text', { text: `%${cleanedText}%` })
        .take(10)
        .getMany();
    }

    return {
      exactMatch: {
        province: exactMatch.province,
        municipality: exactMatch.municipality,
      },
      suggestions,
    };
  }
}
