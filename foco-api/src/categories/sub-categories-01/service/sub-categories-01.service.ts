import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { ErrorManager } from '@app/common/utils/error-manager';
import { CreateAllSubCategoriesDto } from '@app/categories/sub-categories-01/dto/CreateAllCategoriesDto';

@Injectable()
export class SubCategories01Service {
  constructor(
    @InjectRepository(SubCategories01Entity)
    private readonly subCategories01Repository: Repository<SubCategories01Entity>,
    @InjectRepository(SubCategories02Entity)
    private readonly subCategories02Repository: Repository<SubCategories02Entity>,
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  public async createSubCategory01(name: string) {
    try {
      return await this.subCategories01Repository.save({ name });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findSubCategory01ById(category: number) {
    try {
      return await this.subCategories01Repository.findOne({ where: { id: category } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAllSubCategories01() {
    try {
      return await this.subCategories01Repository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async createAllSubCategories(createAllSubCategories: CreateAllSubCategoriesDto): Promise<any> {
    try {
      let { category, sub_categories_01, sub_categories_02 } = createAllSubCategories;

      let findCategory: CategoriesEntity = undefined;
      let findSubCategory01: SubCategories01Entity = undefined;
      let findSubCategory02: SubCategories02Entity = undefined;

      if (category != undefined) {
        findCategory = await this.categoriesRepository.findOne({ where: { id: category } });
      }

      if (sub_categories_01 != undefined) {
        findSubCategory01 = await this.subCategories01Repository.findOne({ where: { name: sub_categories_01 } });
      }
      if (sub_categories_02 != undefined) {
        findSubCategory02 = await this.subCategories02Repository.findOne({ where: { name: sub_categories_02 } });
      }

      // Verificamos que exista la categoria general donde se van a crear las sub categorias
      if (findCategory != null) {
        if (findSubCategory01?.id && findSubCategory02?.id)
          throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Las subcategorias ingresadas ya existen' });

        // Se pregunta si no existe la subcategoria01 y subcategoria2 entonces se crean las subcategorias
        if (findSubCategory01 === null && findSubCategory02 === null) {
          const newSubCat01 = await this.subCategories01Repository.save({ name: sub_categories_01, categories: findCategory });
          return await this.subCategories02Repository.save({ name: sub_categories_02, sub_categories_01: newSubCat01 });
        }

        // Se pregunta si existe la subcategoria01 y no la subcategoria2, entonces se crea la subcategoria02
        if (findSubCategory01 && findSubCategory02 === null) {
          return await this.subCategories02Repository.save({ name: sub_categories_02, sub_categories_01: findSubCategory01 });
        }

        if (findSubCategory01 === null && findSubCategory02 === undefined) {
          return await this.subCategories01Repository.save({ name: sub_categories_01, categories: findCategory });
        }
      } else {
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'Error, categoria no encontrada' });
      }

      return;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAllSubCategories(): Promise<SubCategories01Entity[]> {
    try {
      return await this.subCategories01Repository
        .createQueryBuilder('sub_categories_01')
        .leftJoinAndSelect('sub_categories_01.sub_categories_02', 'sub_categories_02')
        .leftJoinAndSelect('sub_categories_01.categories', 'categories')
        .getMany();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
