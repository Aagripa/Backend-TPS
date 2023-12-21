import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class TeamDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly namaTim: string;
}
