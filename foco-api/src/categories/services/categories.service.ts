import { Injectable, Logger } from '@nestjs/common';
import { In, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';

import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
    @InjectRepository(SubCategories01Entity)
    private readonly subCategories01Repository: Repository<SubCategories01Entity>,
    @InjectRepository(SubCategories02Entity)
    private readonly subCategories02Repository: Repository<SubCategories02Entity>,
  ) { }

  // Método para agregar categorías manualmente
  async addCategory(categoryData: {
    id: number;
    name: string;
    subcategories01: Array<{
      id: number;
      name: string;
      subcategories02: Array<{ id: number; name: string }>;
    }>;
  }) {
    // Implementación similar a createAllCategories pero para una categoría específica
  }

  // Método para página principal - categorías limitadas
  async getCategoriesForHomepage(limit: number = 6): Promise<any[]> {
    // Primero obtener los IDs de las categorías limitadas
    const categoryIds = await this.categoriesRepository
      .createQueryBuilder('category')
      .select('category.id')
      .orderBy('category.id', 'ASC')
      .limit(limit)
      .getMany()
      .then((categories) => categories.map((c) => c.id));

    if (categoryIds.length === 0) {
      return [];
    }

    // Luego obtener las categorías completas con sus relaciones
    const categories = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.sub_categories_01', 'sub1')
      .leftJoinAndSelect('sub1.sub_categories_02', 'sub2')
      .where('category.id IN (:...categoryIds)', { categoryIds })
      .orderBy('category.id', 'ASC')
      .addOrderBy('sub1.id', 'ASC')
      .addOrderBy('sub2.id', 'ASC')
      .getMany();

    return categories.map((category) => this.formatCategoryForHomepage(category));
  }

  // Método para obtener todas las categorías sin límites (para onboarding/filtros)
  async getAllCategories(): Promise<CategoriesEntity[]> {
    try {
      return await this.categoriesRepository.find({
        relations: ['sub_categories_01', 'sub_categories_01.sub_categories_02'],
        order: {
          id: 'ASC',
          sub_categories_01: {
            id: 'ASC',
          },
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private formatCategoryForHomepage(category: CategoriesEntity): any {
    return {
      id: category.id,
      name: category.name,
      subcategories: category.sub_categories_01
        .slice(0, 3) // Máximo 3 subcategorías 1
        .map((sub1) => ({
          id: sub1.id,
          name: sub1.name,
          subcategories: sub1.sub_categories_02
            .slice(0, 5) // Máximo 5 subcategorías 2
            .map((sub2) => ({
              id: sub2.id,
              name: sub2.name,
            })),
        })),
    };
  }
}
