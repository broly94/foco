import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsController } from '@app/ratings_marketing/controllers/ratings_marketing.controller';
import { RatingsMarketingService } from '@app/ratings_marketing/services/ratings_marketing.service';
import { RatingsMarketingEntity } from '@app/ratings_marketing/entities/ratings_marketing.entity';
import { MarketingStrategyModule } from '@app/marketing_strategy/marketing_strategy.module';
import { RequestContextUserMiddleware } from '@app/common/middlewares/request_context_user.middleware';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';

@Module({
  imports: [MarketingStrategyModule, TypeOrmModule.forFeature([RatingsMarketingEntity])],
  controllers: [RatingsController],
  providers: [RatingsMarketingService, RequestContextUserService],
})
export class RatingsMarketingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextUserMiddleware).forRoutes(RatingsController);
  }
}
