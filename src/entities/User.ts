// TODO remove this

// import { IsEmail, IsPhoneNumber, Length, MaxLength, validateOrReject } from "class-validator";
// import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { CaseEntity } from "./Case";
// import { SessionEntity } from "./Session";

// enum UserStatus {
//   BLOCKED = "blocked",
//   ACTIVE = "active",
//   INACTIVE = "inactive"
// }

// enum PreferredPayment {
//   CREDIT = "credit",
//   DEBIT = "debit",
//   UPI = "upi"
// }
// @Entity()
// export class UserEntity extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//   @Column()
//   @MaxLength(50)
//   firstName: string;
//   @Column()
//   @MaxLength(50)
//   lastName: string;
//   @Column()
//   @Length(1, 50)
//   username: string;
//   @Column()
//   @IsEmail()
//   @Length(7, 320)
//   email: string;
//   @Column({ select: false })
//   password: string;
//   @Column()
//   @Length(6, 15)
//   @IsPhoneNumber('IN')
//   phone: string;
//   @Column()
//   preferredPayment: string;
//   @Column({
//     type: "enum",
//     enum: UserStatus,
//     default: UserStatus.ACTIVE
//   })
//   userStatus: UserStatus;
//   @OneToMany(() => SessionEntity, (session) => session.user)
//   sessions: SessionEntity[];
//   @OneToMany(() => CaseEntity, (c) => c.user)
//   cases: CaseEntity[];

//   @BeforeInsert()
//   @BeforeUpdate()
//   async validate() {
//     await validateOrReject(this);
//   }

// }