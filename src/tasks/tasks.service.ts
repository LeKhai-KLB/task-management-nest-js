import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { NotFoundException } from "@nestjs/common/exceptions";
import { TaskRepository } from "./tasks.repository";
import { Task } from "./task.entity";
@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getTasks(taskFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(taskFilterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy(id);
    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    console.log(this.taskRepository);
    return this.taskRepository.createTask(createTaskDto);
  }
  // deleteTaskById(id: string) {
  //   const found = this.getTaskById(id);
  //   this.tasks.filter((task) => task.id !== found.id);
  // }
  async deleteTaskById(id: string): Promise<void> {
    const result = await this.taskRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`Task with ${id} not found`);
  }

  // updateTaskStatus(id: string, status: TaskStatus) {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
  async updateTaskStatus(id: string, status): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
