import { IsISO8601 } from "class-validator";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  @IsISO8601()
  pdoaId: string;
  @Column()
  accessTimestamp: string;
  @Column()
  status: string;
  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}