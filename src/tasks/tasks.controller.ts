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
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { Task } from "./task.entity";
import { AuthGuard } from "@nestjs/passport";
@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  /**
   * - If we have any filters defined, call taskService.getTaskWithFilters
   * - Otherwise, just get all tasks
   */
  getTasks(@Query() taskFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(taskFilterDto);
  }

  @Get("/:id")
  getTaskById(@Param("id") id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete("/:id")
  DeleteTaskById(@Param("id") id: string): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id") id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
