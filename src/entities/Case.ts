import { MaxLength, validateOrReject } from "class-validator";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Status {
  PENDING = "pending",
  INPROGRESS = "inprogress",
  CLOSED = "closed"
}

@Entity()
export class CaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @MaxLength(500)
  reason: string;
  @Column()
  @MaxLength(500)
  comment: string;
  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING
  })
  status: Status;
  @Column()
  user_id: string;
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}