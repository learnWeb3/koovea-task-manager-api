import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerDocument } from '../../customer/customer/customer.schemas';
import {
  AuthenticatedUser,
  DatabaseCustomerNoFetch,
  KeycloakAuthGuard,
  KeycloakAvailableRoles,
  KeycloakRoles,
} from '../../keycloak/keycloak/keycloak-auth.guard';
import { CreateTaskDto } from '../../lib/dto/create-task.dto';
import { UpdateTaskDto } from '../../lib/dto/update-task.dto';
import { IsCreatorOrEnlistedGuard } from '../../task/guards/is-creator-or-enlisted.guard';
import { IsCreatorGuard } from '../../task/guards/is-creator.guard';
import { TaskService } from '../../task/task/task.service';

@ApiTags('task')
@ApiBearerAuth('User RBAC JWT access token')
@UseGuards(KeycloakAuthGuard)
@KeycloakRoles([KeycloakAvailableRoles.USER])
@DatabaseCustomerNoFetch(false)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create a task for the authenticated user' })
  @Post('')
  createTask(
    @AuthenticatedUser() authenticatedUser: CustomerDocument,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.createTask(authenticatedUser._id, createTaskDto);
  }

  @ApiOperation({
    summary:
      'Get a task for the authenticated user, only task creator or enlisted task members can view a specific task.',
  })
  @UseGuards(IsCreatorOrEnlistedGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne({
      _id: id,
    });
  }

  @ApiOperation({
    summary:
      'Update a task for the authenticated user, only task creator or enlisted task members can update a task',
  })
  @UseGuards(IsCreatorOrEnlistedGuard)
  @Patch(':id')
  updateTask(
    @AuthenticatedUser() authenticatedUser: CustomerDocument,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(
      {
        _id: id,
      },
      updateTaskDto,
      authenticatedUser,
    );
  }

  @ApiOperation({
    summary:
      'Delete a task for the authenticated user, only task creator can delete a task',
  })
  @UseGuards(IsCreatorGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask({
      _id: id,
    });
  }
}
