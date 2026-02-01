import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sub-categories-01')
export class SubCategories01Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  sub_category_01_id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => CategoriesEntity, (categories) => categories.sub_categories_01)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'category_id' })
  category: CategoriesEntity;

  @OneToMany(() => SubCategories02Entity, (sub_categories_02) => sub_categories_02.sub_category_01)
  sub_categories_02: SubCategories02Entity[];

  // Relación inversa con MarketingStrategy
  @OneToMany(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.sub_category_01)
  marketing_strategies: MarketingStrategyEntity[];
}
