import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Put,
  Res,  
  Param,
  ParseIntPipe,
  NotFoundException,
  Header,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import TaskService from './task.service';
import { TaskDto } from './task.dto';
import { Task } from './task.entity';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tasks')
export default class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':teamId/:userId/:projectId')
@UseInterceptors(FilesInterceptor('lampiran', 1, {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  }),
}))
async createTask(
  @Body() taskDto: TaskDto,
  @UploadedFile() files: Express.Multer.File[],
  @Param('teamId', ParseIntPipe) teamId: number,
  @Param('userId') userId: string,
  @Param('projectId', ParseIntPipe) projectId: number,
) {
  try {
    // Handle the uploaded files as needed
    const createdTask = await this.taskService.create(taskDto, teamId, userId, projectId, files);
    return createdTask;
  } catch (error) {
    throw new NotFoundException(error.message);
  }}

  


  @Get()
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.taskService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskDto: TaskDto,
  ) {
    try {
      const updatedTask = await this.taskService.update(id, taskDto);
      return { message: 'Task updated successfully', data: updatedTask };
    } catch (error) {
      return { message: 'Failed to update task', error: error.message };
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.taskService.delete(id);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      return { message: 'Failed to delete task', error: error.message };
    }
  }

  @Get('user/:userId')
  async getTasksByUserId(@Param('userId') userId: number): Promise<Task[]> {
    return this.taskService.getTasksByUserId(userId);
  }

  // @Get('byMember/:memberId')
  // async getTasksByMemberId(@Param('memberId', ParseIntPipe) memberId: number): Promise<{ message: string; data?: Task[] } | { message: string }> {
  //   try {
  //     const tasks = await this.taskService.getTasksByMemberId(memberId);
  //     return { message: 'Tasks retrieved successfully', data: tasks };
  //   } catch (error) {
  //     // Handle errors appropriately (e.g., return error message)
  //     return { message: 'Error retrieving tasks' };
  //   }
  // }

  @Get('byUser/:forUser')
  async getTasksByForUser(@Param('forUser') forUser: string): Promise<Task[]> {
    const tasks = await this.taskService.getTasksByForUser(forUser);
    return tasks;
  }

  @Get('project/:projectId')
  async getTasksByProjectId(
    @Param('projectId') projectId: number,
  ): Promise<Task[]> {
    return this.taskService.getTasksByProjectId(projectId);
  }

  @Get('attachment/:taskId')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment')
  async getAttachmentInfo(@Param('taskId', ParseIntPipe) taskId: number, @Res() response: Response) {
    try {
      // Retrieve attachment information from the service
      const attachmentInfo = await this.taskService.getAttachmentInfo(taskId);

      // Send the file as a response
      response.sendFile(attachmentInfo.filePath);

      // Optionally, you can return the file information or any other response
      return { message: 'Attachment retrieved successfully', attachmentInfo };
    } catch (error) {
      throw new NotFoundException(`Failed to retrieve attachment: ${error.message}`);
    }
  }

  @Post(':taskId/upload-attachment')
  @UseInterceptors(FileInterceptor('lampiran', { dest: './uploads' }))
  async uploadAttachment(
    @UploadedFile() file: Express.Multer.File,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Res() response: Response,
  ) {
    try {
      // Ensure that only PDF files are allowed
      if (file && !this.isPDFFile(file.originalname)) {
        return response.status(400).json({
          message: 'Hanya Menerima File PDF',
          status: 'error',
        });
      }

      const uploadResult = await this.taskService.uploadAttachment(taskId, file);

      // Optionally, you can return the file information or any other response
      return response.json({
        message: uploadResult.message,
        filePath: uploadResult.filePath,
        status: uploadResult.status,
      });
    } catch (error) {
      return response.status(500).json({
        message: `Failed to upload attachment: ${error.message}`,
        error: error.message,
        status: 'error',
      });
    }
  }

  // Helper function to check if the file has a PDF extension
  private isPDFFile(fileName: string): boolean {
    const fileExtension = path.extname(fileName).toLowerCase();
    return fileExtension === '.pdf';
  }

  @Delete('attachment/:taskId')
  async deleteAttachment(@Param('taskId', ParseIntPipe) taskId: number) {
    try {
      await this.taskService.deleteAttachment(taskId);
      return { message: 'Attachment deleted successfully' };
    } catch (error) {
      throw new NotFoundException(`Failed to delete attachment: ${error.message}`);
    }
  }
}
