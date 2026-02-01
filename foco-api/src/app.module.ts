import { MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from '@app/config/data-source';
import { ScheduleModule } from '@nestjs/schedule';
import { NodemailerModule } from '@app/common/nodemailer/nodemailer.module';
/* ### Modules Entities ### */
import { UsersModule } from '@app/users/users.module';
import { AuthModule } from '@app/auth/auth.module';
import { AddressUsersModule } from '@app/address_users/address_users.module';
import { MarketingStrategyModule } from '@app/marketing_strategy/marketing_strategy.module';
import { ImagesMarketingModule } from '@app/images_marketing/images_marketing.module';
import { SuscriptionsModule } from '@app/suscriptions/suscriptions.module';
import { RatingsMarketingModule } from '@app/ratings_marketing/ratings_marketing.module';
import { CategoriesModule } from '@app/categories/categories.module';
import { AddressMarketingModule } from '@app/address_marketing/address_marketing.module';
import { OpeningDaysHoursModule } from '@app/opening_days_hours/opening_days_hours.module';
import { SubCategories01Module } from '@app/categories/sub-categories-01/sub-categories-01.module';
import { SubCategories02Module } from '@app/categories/sub-categories-02/sub-categories-02.module';
/* ### Providers ### */
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';
/* ### Middlewares ### */
//import { RequestContextUserMiddleware } from '@app/common/middlewares/request_context_user.middleware';
import { GoogleMapsModule } from '@app/google_maps/google_maps.module';
import { IndexLocationsService } from '@app/locations/services/index_locations.service';
import { LocationsModule } from '@app/locations/locations.module';
import { KeywordsModule } from './keywords/keywords.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV.split(' ')[0]}.env`,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({ ...DataSourceConfig, retryAttempts: 10, retryDelay: 3000 }),
    UsersModule,
    AuthModule,
    AddressUsersModule,
    MarketingStrategyModule,
    ImagesMarketingModule,
    SuscriptionsModule,
    RatingsMarketingModule,
    CategoriesModule,
    AddressMarketingModule,
    OpeningDaysHoursModule,
    NodemailerModule,
    SubCategories01Module,
    SubCategories02Module,
    GoogleMapsModule,
    LocationsModule,
    KeywordsModule,
  ],
  providers: [RequestContextUserService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly indexLocationsService: IndexLocationsService) { }

  async onApplicationBootstrap() {
    await this.indexLocationsService.createProvincesAndMunicipalities();
  }
}
