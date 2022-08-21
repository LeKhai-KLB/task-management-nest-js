import { Injectable } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";
import { v4 as uuid } from "uuid";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { NotFoundException } from "@nestjs/common/exceptions";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const result = this.getAllTasks().filter((task) => {
      let inValid = true;
      Object.keys(filterDto).forEach((key) => {
        if (!inValid) return inValid;
        if (key === "search")
          inValid =
            task.description.includes(filterDto[key]) ||
            task.title.includes(filterDto[key]);
        else inValid = filterDto[key] === task[key];
      });
      return inValid;
    });
    return result;
  }

  getTaskById(id: string): Task {
    const existedTask = this.tasks.find((task) => task.id === id);
    if (!existedTask) throw new NotFoundException(`Task with ${id} not found`);

    return existedTask;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      ...createTaskDto,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTaskById(id: string) {
    const found = this.getTaskById(id);
    this.tasks.filter((task) => task.id !== found.id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
