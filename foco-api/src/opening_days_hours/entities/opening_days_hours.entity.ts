import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DayOfWeek } from '@app/opening_days_hours/interfaces';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';

@Entity('opening_days_hours')
export class OpeningDaysHoursEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DayOfWeek, nullable: false })
  day: DayOfWeek;

  // Cierra al medio dia?
  @Column({ nullable: true, default: false })
  closes_at_noon: boolean;

  // Esta abierto 24hs?
  @Column({ nullable: true, default: false })
  open_24_hours: boolean;

  // Horario de apertura
  @Column({ type: 'time', nullable: true })
  opening_morning: string;

  // Si cierra al medio dia, a que hora cierra al medio dia?
  @Column({ type: 'time', nullable: true })
  closing_morning: string;

  // Si cierra al medio dia, a que hora abre a la tarde?
  @Column({ type: 'time', nullable: true })
  opening_afternoon: string;

  // Horario de cierre
  @Column({ type: 'time', nullable: true })
  closing_evening: string;

  @ManyToOne(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.opening_days_hours)
  @JoinColumn()
  marketing_strategy: MarketingStrategyEntity;
}
