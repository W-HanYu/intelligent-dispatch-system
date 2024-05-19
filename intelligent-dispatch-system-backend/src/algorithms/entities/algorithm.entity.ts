import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PredefinedParam } from './predefined-param.entity';

@Entity()
export class Algorithm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @Column()
  label: string;

  @OneToMany(() => PredefinedParam, (param) => param.algorithm)
  params: PredefinedParam[];
}
