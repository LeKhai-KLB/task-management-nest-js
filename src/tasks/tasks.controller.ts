import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { Task } from "./task.entity";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";

@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger("TasksController");

  constructor(private tasksService: TasksService) {}

  @Get()
  /**
   * - If we have any filters defined, call taskService.getTaskWithFilters
   * - Otherwise, just get all tasks
   */
  getTasks(
    @Query() taskFilterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(
        taskFilterDto,
      )}`,
    );
    return this.tasksService.getTasks(taskFilterDto, user);
  }

  @Get("/:id")
  getTaskById(@Param("id") id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete("/:id")
  DeleteTaskById(
    @GetUser() user: User,
    @Param("id") id: string,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating the Task: ${createTaskDto.title}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @GetUser() user: User,
    @Param("id") id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
