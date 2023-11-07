import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ProjectStatus } from './project.enum';
import { Team } from '../team/team.entity';
import { Task } from '../task/task.entity';

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  idProject: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  projectName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  startDate: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  endDate: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  projectDesc: string;

  @Column({
    type: DataType.ENUM('Pending', 'InProgress', 'Completed'),
    allowNull: false,
    defaultValue: 'Pending',
  })
  status: ProjectStatus;

  @ForeignKey(() => Team) // Menunjukkan foreign key ke model Team
  @Column({
    type: DataType.INTEGER,
    allowNull: false, // Tidak boleh null
  })
  idTim: number;

  @BelongsTo(() => Team) // Menunjukkan hubungan belongs to ke model Team
  team: Team; // Ini akan menjadi referensi ke objek Team yang terkait

  @HasMany(() => Task) // Menunjukkan hubungan has many ke model Task
  tasks: Task[];
}