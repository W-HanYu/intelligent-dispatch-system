import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Algorithm } from './algorithm.entity';

@Entity()
export class PredefinedParam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  param_name: string;

  @Column()
  param_value: string;

  @ManyToOne(() => Algorithm, (algorithm) => algorithm.params)
  algorithm: Algorithm;
}
