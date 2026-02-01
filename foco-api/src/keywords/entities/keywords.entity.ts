import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '@app/config/base.entity';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';

@Entity({ name: 'keywords' })
export class KeywordsEntity extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @ManyToMany(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.keywords_list)
    marketing_strategies: MarketingStrategyEntity[];
}
