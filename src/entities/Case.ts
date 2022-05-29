import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
@Entity()
export class Case extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  reason: string;
  @Column()
  comment: string;
  @Column()
  status: string;
  @ManyToOne(() => User, (user) => user.cases)
  user: User;
}