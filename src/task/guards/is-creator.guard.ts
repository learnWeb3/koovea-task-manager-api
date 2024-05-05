import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CustomerDocument } from '../../customer/customer/customer.schemas';
import { TaskService } from '../task/task.service';
import { TokenPayload } from '../../keycloak/keycloak/keycloak-auth.guard';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private taskService: TaskService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<
        Request & {
          user: CustomerDocument;
          token: TokenPayload;
          roles: string[];
        }
      >();

      const taskId = request.params.id;

      const check = await this.taskService.exists({
        _id: taskId,
        creator: request.user._id,
      });

      return check;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }
}
