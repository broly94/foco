import { ProvincesEntity } from '../entities/provinces.entity';

export interface IMunicipalities {
  municipality_id: string;
  name: string;
  full_name: string;
  province: IProvinces;
  category: string;
  coordinates: ICoordinates;
}

export interface IProvinces {
  province_id: string;
  name: string;
}

export interface ICoordinates {
  lon: number;
  lat: number;
}

export interface ICabaCommune {
  name?: string;
  provincia_id?: ProvincesEntity | string;
  municipality_id?: string;
}
