import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./task.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";

@Controller("tasks")
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  /**
   * - If we have any filters defined, call taskService.getTaskWithFilters
   * - Otherwise, just get all tasks
   */
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (!Object.keys(filterDto).length) return this.tasksService.getAllTasks();
    return this.tasksService.getTaskWithFilters(filterDto);
  }

  @Get("/:id")
  getTaskById(@Param("id") id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete("/:id")
  deleteTaskById(@Param("id") id: string) {
    return this.tasksService.deleteTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    console.log(
      "🚀 ~ file: tasks.controller.ts ~ line 16 ~ TasksController ~ createTask ~ createTaskDto",
      createTaskDto,
    );
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id") id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
