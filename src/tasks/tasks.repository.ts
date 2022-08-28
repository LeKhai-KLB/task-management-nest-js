import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "../auth/user.entity";

@Injectable()
export class TaskRepository {
  private readonly logger = new Logger();
  constructor(@InjectRepository(Task) private repository: Repository<Task>) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.repository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.repository.save(task);
    return task;
  }

  async getTasks(
    taskFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = taskFilterDto;
    const query = this.repository.createQueryBuilder("task");
    query.where({ user });
    if (status) query.andWhere("task.status = :status", { status });
    if (search) {
      query.andWhere(
        "(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))",
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get all task for user ${
          user.username
        }. Filters: ${JSON.stringify(taskFilterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async save(task: Task): Promise<void> {
    await this.repository.save(task);
  }

  async findOneBy(id: string): Promise<Task> {
    return await this.repository.findOneBy({ id });
  }

  async delete(obj: object): Promise<any> {
    return await this.repository.delete(obj);
  }

  getInstance() {
    return this.repository;
  }
}
