import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { SortOrder } from 'mongoose';
import { CustomerDocument } from '../../customer/customer/customer.schemas';
import { TokenPayload } from '../../keycloak/keycloak/keycloak-auth.guard';

export interface SortFilters {
  order?: SortOrder;
  sort?: string;
}

export const SortFiltered = createParamDecorator(
  (sortFilters: SortFilters, ctx: ExecutionContext): SortFilters => {
    const request = ctx.switchToHttp().getRequest<
      Request & {
        user: CustomerDocument | null;
        token: TokenPayload;
        roles: string[];
      }
    >();

    return {
      order: (+request?.query?.order as SortOrder) || sortFilters?.order || -1,
      sort:
        (request?.query?.sort as string) || sortFilters?.sort || 'createdAt',
    };
  },
);
