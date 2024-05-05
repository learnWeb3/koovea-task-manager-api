import { Module, forwardRef } from '@nestjs/common';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Customer,
  CustomerSchema,
} from '../customer/customer/customer.schemas';
import { TaskController } from './task/task.controller';
import { CustomerModule } from '../customer/customer.module';
import { TaskModule } from '../task/task.module';
import { CustomerController } from './customer/customer.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    forwardRef(() => KeycloakModule),
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
    ]),
    forwardRef(() => TaskModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => HttpModule),
  ],
  controllers: [TaskController, CustomerController],
})
export class ApiModule {}
