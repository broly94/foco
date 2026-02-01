import axios from 'axios';
import { ErrorManager } from '@app/common/utils/error-manager';
import { Injectable } from '@nestjs/common';
import { GeoCodeAxios } from '@app/config/config.axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { IndexLocationsService } from '@app/locations/services/index_locations.service';
import { LocationsService } from '@app/locations/services/locations.service';

@Injectable()
export class GoogleMapsService {
  constructor(private readonly axiosServices: HttpService, private readonly locationsServices: LocationsService) { }

  private readonly apiKey = process.env.GOOGLE_MAPS_API_KEY;

  public async getLocationWithCoords(body: { lat: number; lng: number }) {
    try {
      const { data } = await firstValueFrom(
        this.axiosServices.get(
          `https://apis.datos.gob.ar/georef/api/ubicacion?lat=${body.lat}&lon=${body.lng}`,
        ),
      );

      if (!data.ubicacion) {
        throw new Error('No se pudo determinar la ubicación para las coordenadas proporcionadas');
      }

      const { provincia, municipio, departamento } = data.ubicacion;
      const locality = municipio?.nombre || departamento?.nombre || 'Desconocido';
      const province = provincia?.nombre || 'Desconocida';

      return {
        success: true,
        fullAddress: `${province}, ${locality}`,
        province: province,
        locality: locality,
      };
    } catch (error) {
      console.error('Error en getLocationWithCoords (GeoRef):', error);
      throw new Error(`Error al obtener la ubicación: ${error.message}`);
    }
  }

  // Extraer la dirección más relevante de los resultados de Google
  private extractMostRelevantAddress(results: any[]): string | null {
    // Priorizar resultados con tipos específicos
    const priorityTypes = ['administrative_area_level_2', 'administrative_area_level_1'];

    for (const type of priorityTypes) {
      const result = results.find((r) => r.types.includes(type) && r.formatted_address);
      if (result) {
        return result.formatted_address;
      }
    }

    // Si no encuentra por tipos prioritarios, buscar la primera dirección formateada
    const firstFormatted = results.find((r) => r.formatted_address);
    return firstFormatted ? firstFormatted.formatted_address : null;
  }

  public async getLocationWithPlainText(address: string) {
    const { data } = await firstValueFrom(
      this.axiosServices.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address, key: this.apiKey },
      }),
    );
    return data;
  }

  public async generateLocatonsWithCoords(results: any[]) {
    const fullText = results.map((r: any) => r);
    //console.log(fullText[9].formatted_address);
    const newText = await this.locationsServices.findExactLocation(fullText[9].formatted_address);
    return newText;
  }

  public async getAutocompleteSuggestions(query: string) {
    try {
      const { data } = await firstValueFrom(
        this.axiosServices.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: {
            input: query,
            key: this.apiKey,
            types: '(cities)',
            components: 'country:ar', // Limitado a Argentina por defecto como sugerido
            language: 'es',
          },
        }),
      );

      return data;
    } catch (error) {
      console.error('Error en getAutocompleteSuggestions:', error);
      throw new Error(`Error al obtener sugerencias: ${error.message}`);
    }
  }
}

// 'https://maps.googleapis.com/maps/api/geocode/json?address=Buenos%20Aires%20Florencio%20Varela%20Pagani%201365&key=AIzaSyBFrhRFhttNeQUnsHDiEdmmw8ovwxfvzWI',
