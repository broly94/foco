import { UsersEntity } from '@app/users/entities/users.entity';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { AddressMarketingEntity } from '@app/address_marketing/entities/address_marketing.entity';
import { OpeningDaysHoursEntity } from '@app/opening_days_hours/entities/opening_days_hours.entity';
import { RatingsMarketingEntity } from '@app/ratings_marketing/entities/ratings_marketing.entity';

export interface Strategy {
  id: number;
  title: string;
  description: string;
  user: UsersEntity | number;
  category: CategoriesEntity | number;
  website: string;
  address_marketing?: AddressMarketingEntity | number;
  social_media: SocialMedia;
  opening_days_hours: OpeningDaysHoursEntity[];
  ratings_marketing: RatingsMarketingEntity[];
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  free_market?: string;
}
