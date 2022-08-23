import { IsEnum, IsString, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";
export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
