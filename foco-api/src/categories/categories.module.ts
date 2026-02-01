import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from '@app/categories/controllers/categories.controller';
import { CategoriesService } from '@app/categories/services/categories.service';
import { IndexCategoriesService } from '@app/categories/services/index_categories.service';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesEntity, SubCategories01Entity, SubCategories02Entity])],
  controllers: [CategoriesController],
  providers: [CategoriesService, IndexCategoriesService],
  exports: [CategoriesModule, CategoriesService],
})
export class CategoriesModule implements OnApplicationBootstrap {
  constructor(private readonly indexCategoriesService: IndexCategoriesService) {}

  async onApplicationBootstrap() {
    await this.indexCategoriesService.initializeCategories();
  }
}
