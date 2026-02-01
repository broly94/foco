import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class GetAllCategoriesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        return response.map((categories: { id: number; name: string }) => this.mapCategories(categories));
      }),
    );
  }

  private capitalize = (text: string) => {
    const firstLetter = text.charAt(0);
    const rest = text.slice(1);
    return firstLetter.toUpperCase() + rest;
  };

  private mapCategories(categories: { id: number; name: string }) {
    const mapCategories = {
      id: categories.id,
      category: this.capitalize(categories.name),
    };
    return mapCategories;
  }
}
