import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { NotFoundException } from "@nestjs/common/exceptions";
import { TaskRepository } from "./tasks.repository";
import { Task } from "./task.entity";
import { User } from "../auth/user.entity";
import { TaskStatus } from "./task-status.enum";

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getTasks(taskFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(taskFilterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository
      .getInstance()
      .findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
  // deleteTaskById(id: string) {
  //   const found = this.getTaskById(id);
  //   this.tasks.filter((task) => task.id !== found.id);
  // }
  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected === 0)
      throw new NotFoundException(`Task with ${id} not found`);
  }

  // updateTaskStatus(id: string, status: TaskStatus) {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
