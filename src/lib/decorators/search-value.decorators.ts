import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { CustomerDocument } from '../../customer/customer/customer.schemas';
import { TokenPayload } from '../../keycloak/keycloak/keycloak-auth.guard';

export const SearchValue = createParamDecorator(
  (value: string, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<
      Request & {
        user: CustomerDocument | null;
        token: TokenPayload;
        roles: string[];
      }
    >();

    return (request?.query?.value as string) || '';
  },
);
