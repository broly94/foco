import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressMarketingController } from '@app/address_marketing/controllers/address_marketing.controller';
import { AddressMarketingService } from '@app/address_marketing/services/address_marketing.service';
import { AddressMarketingEntity } from '@app/address_marketing/entities/address_marketing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressMarketingEntity])],
  controllers: [AddressMarketingController],
  providers: [AddressMarketingService],
  exports: [AddressMarketingService],
})
export class AddressMarketingModule {}
