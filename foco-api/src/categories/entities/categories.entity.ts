import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';

@Entity('categories')
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  category_id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => SubCategories01Entity, (sub_categories_01) => sub_categories_01.category)
  sub_categories_01: SubCategories01Entity[];

  // Relación inversa con MarketingStrategy
  @OneToMany(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.category)
  marketing_strategies: MarketingStrategyEntity[];
}
