/* eslint-disable @typescript-eslint/no-this-alias */
import { Injectable } from '@nestjs/common';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from './keycloak-auth.guard';

@Injectable()
export class KeycloakService {
  private jwksClient;
  constructor() {
    this.jwksClient = jwksClient({
      jwksUri: process.env.KEYCLOAK_CERTS_URL,
      rateLimit: true,
      cache: true,
    });
  }

  public async verify(
    accessToken: string,
    config: { issuer: string; audience: string },
  ): Promise<TokenPayload> {
    const self = this;

    function getKey(header, callback) {
      self.jwksClient.getSigningKey(header.kid, function (err, key) {
        const signingKey = key?.publicKey || key?.rsaPublicKey || '';
        callback(null, signingKey);
      });
    }

    const decoded: TokenPayload = await new Promise((resolve, reject) =>
      jwt.verify(
        accessToken,
        getKey,
        {
          audience: config.audience,
          issuer: config.issuer,
        },
        function (err, decoded) {
          if (err) {
            reject(err);
          }
          resolve(decoded as TokenPayload);
        },
      ),
    );
    return decoded;
  }
}
