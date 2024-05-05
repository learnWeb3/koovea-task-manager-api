import { Global, Module, forwardRef } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customer/customer.schemas';
import { TaskModule } from '../task/task.module';

@Global()
@Module({
  providers: [CustomerService],
  exports: [CustomerService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
    ]),
    forwardRef(() => TaskModule),
  ],
})
export class CustomerModule {}
