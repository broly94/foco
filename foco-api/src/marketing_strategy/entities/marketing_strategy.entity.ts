import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '@app/config/base.entity';
import { AddressMarketingEntity } from '@app/address_marketing/entities/address_marketing.entity';
import { UsersEntity } from '@app/users/entities/users.entity';
import { ImagesMarketingEntity } from '@app/images_marketing/entities/images_marketing.entity';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { RatingsMarketingEntity } from '@app/ratings_marketing/entities/ratings_marketing.entity';
import { OpeningDaysHoursEntity } from '@app/opening_days_hours/entities/opening_days_hours.entity';
import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';
import { SocialMedia } from '@app/marketing_strategy/interfaces';
import { KeywordsEntity } from '@app/keywords/entities/keywords.entity';

@Entity('marketing_strategy')
export class MarketingStrategyEntity extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  user_phone: boolean;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column('text', { array: true })
  keywords: string[];

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'jsonb', nullable: true })
  social_media: SocialMedia;

  // Foreing keys
  @OneToMany(() => OpeningDaysHoursEntity, (opening_days_hours) => opening_days_hours.marketing_strategy, { cascade: true })
  opening_days_hours: OpeningDaysHoursEntity[];

  @OneToMany(() => ImagesMarketingEntity, (images_marketing) => images_marketing.marketing_strategy_id, { cascade: true })
  images_marketing: ImagesMarketingEntity[];

  @OneToOne(() => AddressMarketingEntity, (address_marketing) => address_marketing.marketing_strategy, { cascade: true })
  address_marketing: AddressMarketingEntity;

  @OneToOne(() => UsersEntity, (user) => user.marketing_strategy)
  @JoinColumn()
  user: UsersEntity;

  @OneToMany(() => RatingsMarketingEntity, (ratings) => ratings.marketing_strategy)
  ratings_marketing: RatingsMarketingEntity[];

  // Relaciones corregidas con categorías
  @ManyToOne(() => CategoriesEntity, (category) => category.marketing_strategies)
  @JoinColumn({ name: 'category_id' })
  category: CategoriesEntity;

  @ManyToOne(() => SubCategories01Entity, (sub_category_01) => sub_category_01.marketing_strategies)
  @JoinColumn({ name: 'sub_category_01_id' })
  sub_category_01: SubCategories01Entity;

  @ManyToMany(() => SubCategories02Entity, (sub_category_02) => sub_category_02.marketing_strategies)
  @JoinTable({
    name: 'marketing_strategy_sub_categories_02', // Nombre de la tabla intermedia
    joinColumn: {
      name: 'marketing_strategy_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'sub_category_02_id',
      referencedColumnName: 'id',
    },
  })
  sub_category_02: SubCategories02Entity[];

  @ManyToMany(() => KeywordsEntity, (keyword) => keyword.marketing_strategies)
  @JoinTable({
    name: 'marketing_strategy_keywords',
    joinColumn: {
      name: 'marketing_strategy_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'keyword_id',
      referencedColumnName: 'id',
    },
  })
  keywords_list: KeywordsEntity[];

  // SoftDelete
  @DeleteDateColumn()
  DeleteAt: Date | null;
}
