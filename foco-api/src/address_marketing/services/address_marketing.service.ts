import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressMarketingEntity } from '@app/address_marketing/entities/address_marketing.entity';
import { ErrorManager } from '@app/common/utils/error-manager';
import { CreateAddressMarketingStrategyDto } from '@app/address_marketing/dto/CreateAddressMarketingStrategyDto';

@Injectable()
export class AddressMarketingService {
  constructor(
    @InjectRepository(AddressMarketingEntity)
    private readonly addressMarketingRepository: Repository<AddressMarketingEntity>,
  ) {}

  public async createAddressMarketingStrategy(body: CreateAddressMarketingStrategyDto) {
    try {
      return await this.addressMarketingRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
