import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseWithMetadata } from "../common/base-with-metadata.entity";

@Entity("users")
export class UserEntity extends BaseWithMetadata {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;
}
