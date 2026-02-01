import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { CreateMarketingStrategyDto } from '@app/marketing_strategy/dto/create_marketing_strategy.dto';
import { CategoriesService } from '@app/categories/services/categories.service';
import { ErrorManager } from '@app/common/utils/error-manager';
import { SubCategories01Service } from '@app/categories/sub-categories-01/service/sub-categories-01.service';
import { UsersService } from '@app/users/services/users.service';
import { UserLoggedAuth } from '@app/common/utils/user-logged-auth';

@Injectable()
export class MarketingStrategyMiddleware implements NestMiddleware {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly subCategories01Service: SubCategories01Service,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, _: Response, next: () => void) {
    try {
      const { idUser } = await UserLoggedAuth(req);

      const user = await this.usersService.findUserById(idUser, false);
      if (!user) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Usuario no encontrado' });
      const Body: CreateMarketingStrategyDto = req.body;

      // const { category, sub_category_01 } = Body;
      // const findCategory = await this.categoriesService.findCategoryById(Number(category));
      // const findSubCategory_01 = await this.subCategories01Service.findSubCategory01ById(Number(sub_category_01));

      // if (!findCategory) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Category not found' });
      // if (!findSubCategory_01) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Sub Category not 01 found' });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }

    next();
  }
}
