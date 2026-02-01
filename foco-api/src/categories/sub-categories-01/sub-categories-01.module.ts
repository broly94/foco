import { Module } from '@nestjs/common';
import { SubCategories01Controller } from './controller/sub-categories-01.controller';
import { SubCategories01Service } from './service/sub-categories-01.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';
import { CategoriesEntity } from '@app/categories//entities/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategories01Entity, SubCategories02Entity, CategoriesEntity])],
  controllers: [SubCategories01Controller],
  providers: [SubCategories01Service],
  exports: [SubCategories01Module, SubCategories01Service],
})
export class SubCategories01Module {}
