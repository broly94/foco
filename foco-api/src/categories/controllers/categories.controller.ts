import { Response } from 'express';
import { Body, Controller, Get, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from '@app/categories/services/categories.service';
import { CreateCategoriesDto } from '@app/categories/dto/CreateCategoriesDto';
import { ErrorManager } from '@app/common/utils/error-manager';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { AccessAdminDecorator } from '@app/common/decorators/access-admin.decorator';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { AccessPublicDecorator } from '@app/common/decorators/access-public.decorator';
import { UpdateCategoriesDto } from '@app/categories/dto/UpdateCategoriesDto';
import { GetAllCategoriesInterceptor } from '@app/categories/interceptors/get-all-categories.interceptor';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(AccessLoginGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @AccessAdminDecorator()
  @Post('create')
  public async createCategories(@Body() category: CreateCategoriesDto) {
    return await this.categoriesService.addCategory(category);
  }

  @AccessPublicDecorator()
  @Get('get-categories')
  public async getCategoriesForHomepage(): Promise<CategoriesEntity[]> {
    return await this.categoriesService.getCategoriesForHomepage();
  }

  // @AccessAdminDecorator()
  // @Put('update')
  // public async updateCategories(@Body() body: UpdateCategoriesDto, @Res() res: Response): Promise<any> {
  //   try {
  //     const category = await this.categoriesService.updateCategories(body);
  //     if (category) return res.json({ message: 'Categoria actualizada', error: false });
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // }

  @AccessPublicDecorator()
  @Get('all')
  public async getAllCategories(): Promise<CategoriesEntity[]> {
    try {
      return await this.categoriesService.getAllCategories();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
