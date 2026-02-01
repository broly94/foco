import { Module } from '@nestjs/common';
import { SubCategories02Controller } from './controller/sub-categories-02.controller';
import { SubCategories02Service } from './service/sub-categories-02.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategories02Entity])],
  controllers: [SubCategories02Controller],
  providers: [SubCategories02Service],
  exports: [SubCategories02Service],
})
export class SubCategories02Module {}
