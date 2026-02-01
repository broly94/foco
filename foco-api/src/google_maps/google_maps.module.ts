import { Module } from '@nestjs/common';
import { GoogleMapsController } from './controllers/google_maps.controller';
import { GoogleMapsService } from './services/google_maps.service';
import { HttpModule } from '@nestjs/axios';
import { LocationsService } from '@app/locations/services/locations.service';
import { IndexLocationsService } from '@app/locations/services/index_locations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipalitiesEntity } from '@app/locations/entities/municipalities.entity';
import { ProvincesEntity } from '@app/locations/entities/provinces.entity';
import { CabaCommunesEntity } from '@app/locations/entities/caba_communes.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([MunicipalitiesEntity, ProvincesEntity, CabaCommunesEntity])],
  controllers: [GoogleMapsController],
  providers: [GoogleMapsService, LocationsService, IndexLocationsService],
})
export class GoogleMapsModule {}
