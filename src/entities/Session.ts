import { IsISO8601, Length, validateOrReject } from "class-validator";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./User";

export enum Status {
  FAILED,
  VERIFIED
}

@Entity()
export class SessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Length(1, 50)
  username: string;
  @Column()
  pdoaId: string;
  @Column({ type: 'timestamptz' })
  @IsISO8601()
  accessTimestamp: Date;
  @Column({
    type: "enum",
    enum: Status
  })
  status: Status;
  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}