import { AccessPublicDecorator } from '@app/common/decorators/access-public.decorator';
import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { GoogleMapsService } from '@app/google_maps/services/google_maps.service';
import { ErrorManager } from '@app/common/utils/error-manager';
import { Request, Response } from 'express';

@Controller('google-maps')
export class GoogleMapsController {
  constructor(private readonly googleMapsService: GoogleMapsService) { }

  @Post('get-location-with-coords')
  public async getLocationWithCoords(@Body() body: any) {
    return await this.googleMapsService.getLocationWithCoords(body);
  }

  @Get('get-location-text-plain')
  public async getLocationWithPlainText(@Query('address') address: string) {
    return await this.googleMapsService.getLocationWithPlainText(address);
  }

  @Get('autocomplete')
  public async autocomplete(@Query('query') query: string) {
    return await this.googleMapsService.getAutocompleteSuggestions(query);
  }
}
