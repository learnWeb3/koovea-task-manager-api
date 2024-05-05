import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CustomerService } from '../../customer/customer/customer.service';
import {
  Pagination,
  Paginated,
} from '../../lib/decorators/pagination.decorator';
import {
  KeycloakAuthGuard,
  KeycloakAvailableRoles,
  DatabaseCustomerNoFetch,
  KeycloakRoles,
  TokenPayload,
} from '../../keycloak/keycloak/keycloak-auth.guard';
import {
  SortFiltered,
  SortFilters,
} from '../../lib/decorators/sort-filters.decorators';
import { SearchValue } from '../../lib/decorators/search-value.decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FindOneTasksDto } from '../../lib/dto/find-one-tasks.dto';
import { FilterQuery } from 'mongoose';
import { Task } from '../../task/task/task.schemas';

@ApiTags('customer')
@ApiBearerAuth('User RBAC JWT access token')
@UseGuards(KeycloakAuthGuard)
@KeycloakRoles([KeycloakAvailableRoles.USER])
@DatabaseCustomerNoFetch(false)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({
    summary:
      'Fetch a list of customers, filters by search value matching fullName or email',
  })
  @ApiQuery({
    name: 'value',
    type: String,
    required: false,
    description:
      'Search value query parameter (search by customer email or full name)',
  })
  @ApiQuery({
    name: 'start',
    type: String,
    required: false,
    description: 'pagination start query parameter',
  })
  @ApiQuery({
    name: 'end',
    type: String,
    required: false,
    description: 'pagination end query parameter',
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'sort field',
  })
  @ApiQuery({
    name: 'order',
    enum: [-1, 1, 'asc', 'ascending', 'desc', 'descending'],
    required: false,
    description: 'sort order',
  })
  @Get('')
  findAllCustomers(
    @SearchValue() searchValue: string,
    @Paginated() pagination: Pagination,
    @SortFiltered() sortFilters: SortFilters,
  ) {
    const filters = {};

    if (searchValue) {
      Object.assign(filters, {
        $or: [
          {
            fullName: { $regex: `^.*${searchValue}.*$`, $options: 'i' },
          },
          {
            email: {
              $regex: `^.*${searchValue}.*$`,
              $options: 'i',
            },
          },
        ],
      });
    }

    return this.customerService.findAll(filters, pagination, sortFilters);
  }

  @ApiOperation({
    summary: 'Register a customer using the jwt token',
  })
  @DatabaseCustomerNoFetch(true)
  @Post('')
  createCustomer(@TokenPayload() tokenPayload: TokenPayload) {
    return this.customerService.create({
      authorizationServerUserId: tokenPayload.sub,
      email: tokenPayload.email,
      firstName: tokenPayload.preferred_username,
      lastName: tokenPayload.family_name,
      fullName: tokenPayload.given_name,
    });
  }

  @ApiOperation({
    summary:
      'Fetch a list of accessible tasks scoped to a given customer accessible tasks',
  })
  @ApiQuery({
    name: 'start',
    type: String,
    required: false,
    description: 'pagination start query parameter',
  })
  @ApiQuery({
    name: 'end',
    type: String,
    required: false,
    description: 'pagination end query parameter',
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'sort field',
  })
  @ApiQuery({
    name: 'order',
    enum: [-1, 1, 'asc', 'ascending', 'desc', 'descending'],
    required: false,
    description: 'sort order',
  })
  @ApiQuery({
    name: 'value',
    type: String,
    required: false,
    description: 'Search value query parameter (search by task label)',
  })
  @Get(':id/tasks')
  findOneTasks(
    @Param('id') id: string,
    findOneTasksDto: FindOneTasksDto,
    @Paginated()
    pagination: Pagination,
    @SortFiltered()
    sortFilters: SortFilters,
    @SearchValue() searchValue: string,
  ) {
    const filters: FilterQuery<Task> = {
      $or: [{ creator: id }, { enlisted: id }],
    };
    if (findOneTasksDto?.status) {
      Object.assign(filters, { status: findOneTasksDto.status });
    }
    if (searchValue) {
      Object.assign(filters, {
        label: {
          $regex: `^.*${searchValue}.*$`,
          $options: 'i',
        },
      });
    }
    return this.customerService.findOneTasks(
      id,
      filters,
      pagination,
      sortFilters,
    );
  }
}
