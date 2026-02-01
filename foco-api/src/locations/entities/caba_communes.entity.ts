import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/config/base.entity';
import { MunicipalitiesEntity } from '@app/locations/entities/municipalities.entity';

@Entity('caba_communes')
export class CabaCommunesEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => MunicipalitiesEntity, (municipality) => municipality.commune)
  @JoinColumn({ name: 'municipality_id', referencedColumnName: 'municipality_id' })
  municipality: MunicipalitiesEntity; // Cambiar el nombre de la propiedad

  @Column({ type: 'varchar' })
  municipality_id: string;
}
