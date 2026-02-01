import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketingStrategyController } from '@app/marketing_strategy/controllers/marketing_strategy.controller';
import { MarketingStrategyService } from '@app/marketing_strategy/services/marketing_strategy.service';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { AddressMarketingModule } from '@app/address_marketing/address_marketing.module';
import { UsersEntity } from '@app/users/entities/users.entity';
import { CategoriesModule } from '@app/categories/categories.module';
import { SubCategories02Module } from '@app/categories/sub-categories-02/sub-categories-02.module';
import { SubCategories01Module } from '@app/categories/sub-categories-01/sub-categories-01.module';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { MarketingStrategyMiddleware } from '@app/marketing_strategy/middlewares/marketing_strategy.middleware';
import { RequestContextUserMiddleware } from '@app/common/middlewares/request_context_user.middleware';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';
import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';
import { KeywordsEntity } from '@app/keywords/entities/keywords.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketingStrategyEntity,
      UsersEntity,
      CategoriesEntity,
      SubCategories01Entity,
      SubCategories02Entity,
      KeywordsEntity,
    ]),
    AddressMarketingModule,
    CategoriesModule,
    SubCategories01Module,
    SubCategories02Module,
  ],
  controllers: [MarketingStrategyController],
  providers: [MarketingStrategyService, RequestContextUserService],
  exports: [MarketingStrategyService, MarketingStrategyModule],
})
export class MarketingStrategyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextUserMiddleware)
      .exclude(
        { method: RequestMethod.GET, path: 'marketing-strategy/get-all' },
        { method: RequestMethod.GET, path: 'marketing-strategy/google-maps' },
      )
      .forRoutes(MarketingStrategyController);
    consumer.apply(MarketingStrategyMiddleware).forRoutes(
      { method: RequestMethod.POST, path: 'marketing-strategy/create' },
      { method: RequestMethod.DELETE, path: 'marketing-strategy/delete' },
      { method: RequestMethod.POST, path: 'marketing-strategy/restore' },
      //{ method: RequestMethod.POST, path: 'marketing-strategy/get-all' },
    );
  }
}
