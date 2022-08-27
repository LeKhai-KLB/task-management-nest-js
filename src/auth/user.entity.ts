import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "../tasks/task.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany((_) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
