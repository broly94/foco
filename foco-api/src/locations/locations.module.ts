import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './controllers/locations.controller';
import { LocationsService } from './services/locations.service';
import { ProvincesEntity } from '@app/locations/entities/provinces.entity';
import { MunicipalitiesEntity } from '@app/locations/entities/municipalities.entity';
import { CabaCommunesEntity } from '@app/locations/entities/caba_communes.entity';
import { IndexLocationsService } from '@app/locations/services/index_locations.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProvincesEntity, MunicipalitiesEntity, CabaCommunesEntity])],
  controllers: [LocationsController],
  providers: [LocationsService, IndexLocationsService],
  exports: [LocationsService, IndexLocationsService],
})
export class LocationsModule {}
