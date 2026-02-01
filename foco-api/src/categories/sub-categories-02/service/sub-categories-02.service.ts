import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategories02Entity } from '../entities/sub-categories-02.entity';
import { Repository } from 'typeorm';
import { ErrorManager } from '@app/common/utils/error-manager';

@Injectable()
export class SubCategories02Service {
  constructor(
    @InjectRepository(SubCategories02Entity)
    private readonly subCategories02Repository: Repository<SubCategories02Entity>,
  ) {}

  public async findSubCategoy02ById(category: number) {
    try {
      return await this.subCategories02Repository.findOne({ where: { id: category } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
