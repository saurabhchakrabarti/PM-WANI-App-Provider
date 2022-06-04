import { IsEmail, IsPhoneNumber, Length, Max } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Case } from "./Case";
import { Session } from "./Session";

enum UserStatus {
  BLOCKED = "blocked",
  ACTIVE = "active",
  INACTIVE = "inactive"
}

enum PreferredPayment {
  CREDIT = "credit",
  DEBIT = "debit",
  UPI = "upi"
}
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Max(50)
  firstName: string;
  @Column()
  @Max(50)
  lastName: string;
  @Column()
  @Length(1, 50)
  username: string;
  @Column()
  @IsEmail()
  @Length(7, 254)
  email: string;
  @Column({ select: false })
  password: string;
  @Column()
  @Length(6, 15)
  @IsPhoneNumber('IN')
  phone: string;
  @Column({
    type: "enum",
    enum: PreferredPayment
  })
  preferredPayment: string;
  @Column({
    type: "enum",
    enum: UserStatus
  })
  userStatus: number;
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
  @OneToMany(() => Case, (c) => c.user)
  cases: Case[];
}