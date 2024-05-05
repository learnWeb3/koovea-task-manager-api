import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { Reflector } from '@nestjs/core';
import { CustomerDocument } from '../../customer/customer/customer.schemas';
import { Request } from 'express';
import { CustomerService } from '../../customer/customer/customer.service';

export enum KeycloakAvailableRoles {
  USER = 'user',
}

export const KeycloakAuthIgnore = Reflector.createDecorator<boolean>();

export const DatabaseCustomerNoFetch = Reflector.createDecorator<boolean>();

export const KeycloakRoles =
  Reflector.createDecorator<KeycloakAvailableRoles[]>();

export const AuthenticatedUserRoles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<
      Request & {
        user: CustomerDocument;
        roles: string[];
        token: TokenPayload;
      }
    >();

    return request.roles;
  },
);

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<
      Request & {
        user: CustomerDocument | null;
        token: TokenPayload;
        roles: string[];
      }
    >();

    return request.user;
  },
);

export interface TokenPayload {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [key: string]: {
      roles: string[];
    };
  };
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export const TokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<
      Request & {
        user: CustomerDocument | null;
        token: TokenPayload;
        roles: string[];
      }
    >();

    return request.token;
  },
);

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  private readonly KEYCLOAK_AUDIENCE = process.env.KEYCLOAK_AUDIENCE;
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly reflector: Reflector,
    private readonly customerService: CustomerService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.getAllAndOverride(KeycloakRoles, [
        context.getHandler(),
        context.getClass(),
      ]);
      // || [
      //   KeycloakAvailableRoles.USER,
      // ];

      // console.log(roles);
      const authIgnore: boolean =
        this.reflector.getAllAndOverride(KeycloakAuthIgnore, [
          context.getHandler(),
          context.getClass(),
        ]) || false;

      const customerDocumentIgnore = this.reflector.getAllAndOverride(
        DatabaseCustomerNoFetch,
        [context.getHandler(), context.getClass()],
      );

      // || false;

      if (authIgnore) {
        return true;
      }

      const request = context.switchToHttp().getRequest<
        Request & {
          user: CustomerDocument | null;
          token: TokenPayload;
          roles: string[];
        }
      >();
      const authorizationHeader = request.headers?.['authorization'] || null;
      if (!authorizationHeader) {
        throw new ForbiddenException(`missing authorization headers`);
      }
      const match = /^Bearer\s.+/.test(authorizationHeader);
      if (!match) {
        throw new UnauthorizedException(
          `Authorization header was malformed, ex`,
        );
      }
      const accessToken = authorizationHeader.replaceAll('Bearer ', '');

      const payload: TokenPayload = await this.keycloakService.verify(
        accessToken,
        {
          issuer: process.env.KEYCLOAK_ISSUER,
          audience: process.env.KEYCLOAK_AUDIENCE,
        },
      );
      if (!payload?.resource_access[this.KEYCLOAK_AUDIENCE]?.roles?.length) {
        throw new UnauthorizedException(`Bearer access token malformed`);
      }
      const payloadRolesMapping = payload.resource_access[
        this.KEYCLOAK_AUDIENCE
      ].roles?.reduce(
        (map, role) => {
          map[role] = true;
          return map;
        },
        {} as Record<string, boolean>,
      );

      let isRoleValid: boolean = false;
      for (const role of roles) {
        if (payloadRolesMapping[role]) {
          isRoleValid = true;
          break;
        }
      }

      if (!isRoleValid) {
        return false;
      }

      const databaseUser: CustomerDocument | null = customerDocumentIgnore
        ? null
        : await this.customerService.findOne({
            authorizationServerUserId: payload.sub,
          });

      // console.log(customerDocumentIgnore);

      if (!databaseUser && !customerDocumentIgnore) {
        throw new ForbiddenException(`invalid access token`);
      }

      request.user = databaseUser;
      request.roles = payload.resource_access[this.KEYCLOAK_AUDIENCE].roles;
      request.token = payload;

      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }
}
