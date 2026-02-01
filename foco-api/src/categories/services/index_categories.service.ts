import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CategoriesEntity } from '../entities/categories.entity';
import { SubCategories01Entity } from '../sub-categories-01/entities/sub-categories-01.entity';
import { SubCategories02Entity } from '../sub-categories-02/entities/sub-categories-02.entity';
import * as categoriesData from '@app/common/data/categories.json';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IndexCategoriesService {
  private readonly logger = new Logger(IndexCategoriesService.name);
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
    @InjectRepository(SubCategories01Entity)
    private readonly subCategories01Repository: Repository<SubCategories01Entity>,
    @InjectRepository(SubCategories02Entity)
    private readonly subCategories02Repository: Repository<SubCategories02Entity>,
  ) {}
  async initializeCategories() {
    try {
      const existingCategoriesCount = await this.categoriesRepository.count();

      if (existingCategoriesCount === 0) {
        await this.createAllCategories();
        this.logger.log('Todas las categorías creadas exitosamente');
      } else {
        await this.updateExistingCategories();
        this.logger.log('Categorías actualizadas exitosamente!!');
      }
    } catch (error) {
      this.logger.error('Error inicializando categorías:', error);
    }
  }

  private async createAllCategories() {
    for (const categoryData of categoriesData.categories) {
      const category = this.categoriesRepository.create({
        category_id: categoryData.category_id,
        name: categoryData.name,
      });
      await this.categoriesRepository.save(category);

      for (const subCat01Data of categoryData.subcategories01) {
        const subCategory01 = this.subCategories01Repository.create({
          sub_category_01_id: subCat01Data.sub_category_01_id,
          name: subCat01Data.name,
          category: category,
        });
        await this.subCategories01Repository.save(subCategory01);

        for (const subCat02Data of subCat01Data.subcategories02) {
          const subCategory02 = this.subCategories02Repository.create({
            sub_category_02_id: subCat02Data.sub_category_02_id,
            name: subCat02Data.name,
            sub_category_01: subCategory01,
          });
          await this.subCategories02Repository.save(subCategory02);
        }
      }
    }
  }

  private async updateExistingCategories() {
    // Obtener IDs existentes
    const existingCategoryIds = (await this.categoriesRepository.find()).map((c) => c.id);
    const existingSubCat01Ids = (await this.subCategories01Repository.find()).map((sc) => sc.id);
    const existingSubCat02Ids = (await this.subCategories02Repository.find()).map((sc) => sc.id);

    for (const categoryData of categoriesData.categories) {
      // Verificar si la categoría ya existe
      let category = await this.categoriesRepository.findOne({
        where: { category_id: categoryData.category_id },
      });

      if (!category) {
        // Crear nueva categoría
        category = this.categoriesRepository.create({
          category_id: categoryData.category_id,
          name: categoryData.name,
        });
        await this.categoriesRepository.save(category);
      } else if (category.name !== categoryData.name) {
        // Actualizar nombre si cambió
        category.name = categoryData.name;
        await this.categoriesRepository.save(category);
      }

      // Procesar subcategorías nivel 1
      for (const subCat01Data of categoryData.subcategories01) {
        let subCategory01 = await this.subCategories01Repository.findOne({
          where: { sub_category_01_id: subCat01Data.sub_category_01_id },
          relations: ['category'],
        });

        if (subCategory01 == null) {
          // Crear nueva subcategoría 1
          subCategory01 = this.subCategories01Repository.create({
            sub_category_01_id: subCat01Data.sub_category_01_id,
            name: subCat01Data.name,
            category: category,
          });
          await this.subCategories01Repository.save(subCategory01);
        } else if (subCategory01.name !== subCat01Data.name || subCategory01.category.category_id !== category.category_id) {
          // Actualizar si cambió el nombre o la categoría padre
          subCategory01.name = subCat01Data.name;
          subCategory01.category = category;
          await this.subCategories01Repository.save(subCategory01);
        }

        // Procesar subcategorías nivel 2
        for (const subCat02Data of subCat01Data.subcategories02) {
          let subCategory02 = await this.subCategories02Repository.findOne({
            where: { sub_category_02_id: subCat02Data.sub_category_02_id },
            relations: ['sub_category_01'],
          });
          if (subCategory02 == null) {
            // Crear nueva subcategoría 2
            subCategory02 = this.subCategories02Repository.create({
              sub_category_02_id: subCat02Data.sub_category_02_id,
              name: subCat02Data.name,
              sub_category_01: subCategory01,
            });
            await this.subCategories02Repository.save(subCategory02);
          } else if (
            subCategory02.name !== subCat02Data.name ||
            subCategory02.sub_category_01.sub_category_01_id !== subCategory01.sub_category_01_id
          ) {
            // Actualizar si cambió el nombre o la subcategoría padre
            subCategory02.name = subCat02Data.name;
            subCategory02.sub_category_01 = subCategory01;
            await this.subCategories02Repository.save(subCategory02);
          }
        }
      }
    }

    // Opcional: Eliminar categorías que ya no existen en el JSON
    await this.cleanupRemovedCategories(existingCategoryIds, existingSubCat01Ids, existingSubCat02Ids);
  }

  private async cleanupRemovedCategories(existingCategoryIds: number[], existingSubCat01Ids: number[], existingSubCat02Ids: number[]) {
    const jsonCategoryIds = categoriesData.categories.map((c) => c.category_id);
    const categoriesToRemove = existingCategoryIds.filter((id) => !jsonCategoryIds.includes(id));

    if (categoriesToRemove.length > 0) {
      await this.categoriesRepository.delete({ id: In(categoriesToRemove) });
      this.logger.warn(`Categorías eliminadas: ${categoriesToRemove.join(', ')}`);
    }
  }
}
