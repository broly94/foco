import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sub-categories-02')
export class SubCategories02Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  sub_category_02_id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => SubCategories01Entity, (sub_category_01) => sub_category_01.sub_categories_02)
  @JoinColumn({ name: 'sub_category_01_id', referencedColumnName: 'sub_category_01_id' })
  sub_category_01: SubCategories01Entity;

  @ManyToMany(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.sub_category_02)
  marketing_strategies: MarketingStrategyEntity[];
}
