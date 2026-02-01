import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface SubCategories {
  id: number;
  name: string;
  sub_categories_02: [{ id: number; name: string }];
  categories: { id: number; name: string };
}

@Injectable()
export class SubCategories01Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        return response.map((subCategories: SubCategories) => this.mapSubCategories(subCategories));
      }),
    );
  }

  private capitalize = (text: string) => {
    const firstLetter = text.charAt(0);
    const rest = text.slice(1);
    return firstLetter.toUpperCase() + rest;
  };

  private mapSubCategories(subCategories: SubCategories) {
    return {
      category_id: subCategories.categories.id,
      category_name: this.capitalize(subCategories.categories.name),
      sub_category_01: this.capitalize(subCategories.name),
      sub_categories_02: subCategories.sub_categories_02.map((subCat02: { id: number; name: string }) => this.capitalize(subCat02.name)),
    };
  }
}
