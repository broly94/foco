import { Body, Controller, Get, Inject, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { SubCategories01Service } from '@app/categories/sub-categories-01/service/sub-categories-01.service';
import { CreateAllSubCategoriesDto } from '@app/categories/sub-categories-01/dto/CreateAllCategoriesDto';
import { ErrorManager } from '@app/common/utils/error-manager';
import { ApiTags } from '@nestjs/swagger';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { AccessAdminDecorator } from '@app/common/decorators/access-admin.decorator';
import { SubCategories01Interceptor } from '@app/categories/sub-categories-01/interceptors/sub-categories-01.interceptor';

@ApiTags('Sub Categories')
@Controller('sub-categories')
@UseGuards(AccessLoginGuard)
export class SubCategories01Controller {
  constructor(private readonly subCategories01Service: SubCategories01Service) {}

  @AccessAdminDecorator()
  @Post('create-all')
  public async createAllSubCategories(@Body() body: CreateAllSubCategoriesDto) {
    try {
      return await this.subCategories01Service.createAllSubCategories(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @UseInterceptors(SubCategories01Interceptor)
  @AccessAdminDecorator()
  @Get('all')
  public async getAllSubCategories() {
    try {
      return await this.subCategories01Service.getAllSubCategories();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
