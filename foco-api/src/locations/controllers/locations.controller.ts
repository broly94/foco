import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LocationsService } from '@app/locations/services/locations.service';
import { ErrorManager } from '@app/common/utils/error-manager';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsServices: LocationsService) {}

  @Get('municipalities/:province_id')
  public async getMunicipalitiesByProvince(@Param('province_id') province_id: string): Promise<any> {
    try {
      return await this.locationsServices.getMunicipalitiesByProvince(province_id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Get('provinces')
  public async getProvinces() {
    try {
      return await this.locationsServices.getProvinces();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Get('municipalities-by-province')
  public async getMunicipalitiesByProvinceIdAndText(@Query('provinceId') provinceId: string, @Query('query') query: string): Promise<any> {
    try {
      return await this.locationsServices.getMunicipalitiesByProvinceIdAndText(provinceId, query);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Get('locations-by-text')
  public async getLocationsWords(@Query() param: { text: string }): Promise<string> {
    const { text } = param;
    let decodedUri = decodeURI(text);
    return await this.locationsServices.getLocationsByText(decodedUri);
  }

  @Get('search-exact')
  async searchExactLocation(@Query('q') query: string) {
    try {
      const result = await this.locationsServices.findExactLocation(query);
      return {
        success: true,
        data: result,
        message:
          result.matchType === 'exact'
            ? 'Ubicación encontrada exactamente'
            : result.matchType === 'partial'
            ? 'Ubicación encontrada parcialmente'
            : 'Ubicación no encontrada',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  //Controlador para buscar provincias y municipios por sugerencias
  //Probar con el texto que ingresa la gente, general mente no es exacto
  @Get('search-smart')
  async smartSearch(@Query('q') query: string) {
    try {
      const result = await this.locationsServices.smartLocationSearch(query);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }
}
