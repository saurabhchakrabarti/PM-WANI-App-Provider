import { IsEmail } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Case } from "./Case";
import { Session } from "./Session";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  username: string;
  @Column()
  @IsEmail()
  email: string;
  @Column()
  password: string;
  @Column()
  phone: string;
  @Column()
  preferredPayment: string;
  @Column()
  userStatus: number;
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
  @OneToMany(() => Case, (c) => c.user)
  cases: Case[];
}