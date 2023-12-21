import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import {
  MEMBER_REPOSITORY,
  PROJECT_REPOSITORY,
  TASK_REPOSITORY,
  TEAM_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/constants';
import { Task } from './task.entity';
import { TaskDto } from './task.dto';
import { Team } from '../team/team.entity';
import { Member } from '../member/member.entity';
import { Project } from '../project/project.entity';
import { User } from '../users/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export default class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task,
    @Inject(TEAM_REPOSITORY) private readonly teamRepository: typeof Team,
    @Inject(MEMBER_REPOSITORY) private readonly memberRepository: typeof Member,
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: typeof Project,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(
    taskDto: TaskDto,
    teamId: number,
    userId: string,
    projectId: number,
    files: Express.Multer.File[],
  ): Promise<Task> {
    // Pastikan idTim, userId, dan projectId yang diberikan valid
    const team = await this.teamRepository.findByPk(teamId);
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
  
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    const project = await this.projectRepository.findByPk(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
  
    try {
      // Handle the uploaded files as needed
      const taskData = { ...taskDto, teamId, userId, projectId };
      const createdTask = await this.taskRepository.create<Task>(taskData);
  
      // Sekarang Anda dapat mengembalikan tugas yang telah dibuat
      return createdTask;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.findAll<Task>({
      include: [{ all: true }],
    });
  } 

  async findById(id: number): Promise<Task> {
    const task = await this.taskRepository.findByPk(id, {
      include: [{ all: true }], // Mengambil semua data terkait
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, taskDto: TaskDto): Promise<Task> {
    const task = await this.findById(id);

    // Di sini, Anda bisa menambahkan logika validasi data jika diperlukan
    // Sebelum melakukan pembaruan pada entitas Task.
    return await task.update(taskDto);
  }

  async delete(id: number): Promise<void> {
    const task = await this.findById(id);

    await task.destroy();

    // Setelah tugas dihapus, log pesan informasi.
    this.logger.log(`Tugas dengan ID ${id} telah dihapus.`);
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    const tasks = await this.taskRepository.findAll<Task>({
      where: {
        userId: userId,
      },
      include: [{ all: true }], // Mengambil semua data terkait
    });
  
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`No tasks found for user with ID ${userId}`);
    }
  
    return tasks;
  }

//   async getTasksByMemberId(memberId: number): Promise<Task[]> {
//   const tasks = await this.taskRepository.findAll({
//     where: {
//       memberId: memberId,
//     },
//     include: [Team, Member, Project], // Sertakan relasi yang dibutuhkan (jika ada)
//   });
//   return tasks;
// }

// async getTasksByMemberId(memberId: number): Promise<Task[]> {
//   const tasks = await this.taskRepository.findAll({
//     where: {
//       userId: memberId,
//     },
//   });
//   if (!tasks || tasks.length === 0) {
//     throw new NotFoundException(`No tasks found for member with ID ${memberId}`);
//   }
//   return tasks;
// }

async getTasksByForUser(forUser: string): Promise<Task[]> {
  const tasks = await this.taskRepository.findAll({
    where: {
      forUser: forUser,
    },
  });
  if (!tasks || tasks.length === 0) {
    throw new NotFoundException(`No tasks found for user with ID ${forUser}`);
  }
  return tasks;
}

async getTasksByProjectId(projectId: number): Promise<Task[]> {
  const tasks = await this.taskRepository.findAll<Task>({
    where: {
      projectId: projectId,
    },
    include: [{ all: true }], // Mengambil semua data terkait
  });

  if (!tasks || tasks.length === 0) {
    throw new NotFoundException(`No tasks found for project with ID ${projectId}`);
  }

  return tasks;
}

async getAttachmentInfo(taskId: number) {
  try {
    // Retrieve attachment information from the database or any other storage
    const fileName = `${taskId}_attachment.txt`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    // Optionally, you can return the file information or any other response
    return { message: 'Attachment information retrieved successfully', filePath };
  } catch (error) {
    throw new Error(`Failed to retrieve attachment information: ${error.message}`);
  }
}

async uploadAttachment(taskId: number, file: Express.Multer.File) {
  try {
    // Handle the uploaded file as needed
    const decodedContent = file ? fs.readFileSync(file.path, { encoding: 'base64' }) : null;

    // Optionally, you can save the file path or perform additional processing
    const fileName = `${taskId}_attachment.txt`;
    const filePath = path.join(__dirname, 'uploads', fileName);
    fs.writeFileSync(filePath, decodedContent, 'base64');

    // Optionally, you can return the file information or any other response
    return { message: 'Attachment uploaded successfully', filePath, status: 'success' };
  } catch (error) {
    // You can customize the error response here
    console.error(`Failed to upload attachment: ${error.message}`);
    return { message: 'Failed to upload attachment', error: error.message, status: 'error' };
  }
}

async deleteAttachment(taskId: number) {
  try {
    // Retrieve attachment information from the database or any other storage
    const fileName = `${taskId}_attachment.txt`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    // Optionally, you can perform additional validation or checks here

    // Delete the file
    fs.unlinkSync(filePath);

    // Optionally, you can update the database to reflect the deletion
    // For example, you can set the attachment-related fields to null in the task entity

    return { message: 'Attachment deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete attachment: ${error.message}`);
  }
}
}