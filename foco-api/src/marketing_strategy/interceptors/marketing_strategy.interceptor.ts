import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { MarketingStrategyEntity } from '../entities/marketing_strategy.entity';
@Injectable()
export class MarketingStrategyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (!response) return response;
        const isArray = Array.isArray(response);
        const data = isArray ? response : [response];
        const mappedData = data.map((res: MarketingStrategyEntity) => this.mapMarketingStrategy(res));
        return isArray ? mappedData : mappedData[0];
      }),
    );
  }

  private mapMarketingStrategy(strategy: MarketingStrategyEntity) {
    const { id, title, description, category, sub_category_01, sub_category_02, phone, keywords, website, social_media, ...res } = strategy;
    const responseMarketingStrategy = {
      id,
      title,
      description,
      phone,
      keywords,
      website,
      social_media,
      user: {
        id: res.user?.id,
        name: res.user?.name,
        lastName: res.user?.lastName,
        email: res.user?.email,
        userType: res.user?.userType,
      },
      categories: {
        category,
        sub_category_01,
        sub_category_02,
      },
    };

    return responseMarketingStrategy;
  }
}
