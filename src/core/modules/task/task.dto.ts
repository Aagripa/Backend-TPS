import { Status } from './status.enum';
import { IsString, IsOptional } from 'class-validator';

export class TaskDto {
  @IsString()
  name?: string;

  @IsOptional()
  startDate?: string;
  endDate?: string;
  taskDesc?: string;
  status: Status;
  forUser?: string;
  forName?: string;
  parentId?: number;
  comment?: string;
}