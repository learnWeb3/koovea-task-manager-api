import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HttpService } from '@nestjs/axios';
import { AppModule } from '../src/app.module';
import { stringify } from 'querystring';
import { CustomerService } from '../src/customer/customer/customer.service';
import { TaskService } from '../src/task/task/task.service';
import { TaskStatus } from '../src/lib/interfaces/task-status.enum';
import * as mongoose from 'mongoose';

async function getUserToken(
  app: INestApplication,
  tokenIssuer: string,
  user: { email: string; password: string },
): Promise<string> {
  const clientId = 'koovea-public-app';
  const body = stringify({
    client_id: clientId,
    username: user.email,
    password: user.password,
    grant_type: 'password',
  });

  return await app
    .get(HttpService)
    .axiosRef.post(tokenIssuer + '/protocol/openid-connect/token', body, {
      headers: { 'Content-Type': ' application/x-www-form-urlencoded' },
    })
    .then((response) => {
      return response.data.access_token;
    });
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;
  let mikeToken: string;
  let jackoToken: string;
  let danielleToken: string;
  let mikeId: string;
  let jackoId: string;
  let mikeTaskId: string;
  let jackoTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  beforeEach(async () => {
    mikeToken = await getUserToken(app, process.env.KEYCLOAK_ISSUER, {
      email: 'mike@yopmail.com',
      password: 'foobar',
    });
    jackoToken = await getUserToken(app, process.env.KEYCLOAK_ISSUER, {
      email: 'jacko@yopmail.com',
      password: 'foobar',
    });
    danielleToken = await getUserToken(app, process.env.KEYCLOAK_ISSUER, {
      email: 'danielle@yopmail.com',
      password: 'foobar',
    });
  });

  afterAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.get(CustomerService).deleteCustomers({ _id: { $ne: null } });
    await app.get(TaskService).deleteTasks({ _id: { $ne: null } });
    await app.close();
    await mongoose.disconnect();
    server.close();
  });

  it('/customer (POST), register a mike user using an access token for the user', () => {
    return request(server)
      .post('/customer')
      .set('Authorization', 'Bearer ' + mikeToken)
      .send({})
      .expect(201)
      .then((res) => {
        mikeId = res.body._id;
      });
  });

  it('/customer (POST), register a jacko user using an access token for the user', () => {
    return request(server)
      .post('/customer')
      .set('Authorization', 'Bearer ' + jackoToken)
      .send({})
      .expect(201)
      .then((res) => {
        jackoId = res.body._id;
      });
  });

  it('list mike tasks using an access token for the user', () => {
    return request(server)
      .get(`/customer/${mikeId}/tasks`)
      .set('Authorization', 'Bearer ' + mikeToken)
      .expect(200)
      .expect(function (res) {
        res.body.results.length = 0;
      });
  });

  it('list jacko tasks using an access token for the user', () => {
    return request(server)
      .get(`/customer/${jackoId}/tasks`)
      .set('Authorization', 'Bearer ' + jackoToken)
      .expect(200)
      .expect(function (res) {
        res.body.results.length = 0;
      });
  });

  it('/task (POST), register a task for mike user using an access token for the user', () => {
    return request(server)
      .post('/task')
      .set('Authorization', 'Bearer ' + mikeToken)
      .send({
        label: 'mike task',
        description: 'this is the mike task',
      })
      .expect(201)
      .then((res) => {
        mikeTaskId = res.body._id;
      });
  });

  it('/task (POST), register a task for jacko user using an access token for the user', () => {
    return request(server)
      .post('/task')
      .set('Authorization', 'Bearer ' + jackoToken)
      .send({
        label: 'jacko task',
        description: 'this is the jacko task',
      })
      .expect(201)
      .then((res) => {
        jackoTaskId = res.body._id;
      });
  });

  it('list mike tasks using an access token for the user', () => {
    return request(server)
      .get(`/customer/${mikeId}/tasks`)
      .set('Authorization', 'Bearer ' + mikeToken)
      .expect(200)
      .expect(function (res) {
        res.body.results.length = 1;
      });
  });

  it('list jacko tasks using an access token for the user', () => {
    return request(server)
      .get(`/customer/${jackoId}/tasks`)
      .set('Authorization', 'Bearer ' + jackoToken)
      .expect(200)
      .expect(function (res) {
        res.body.results.length = 1;
      });
  });

  it('/task/:id (PATCH), update mike task enlisting jacko using an access token for the mike user', () => {
    return request(server)
      .patch(`/task/${mikeTaskId}`)
      .send({
        enlisted: [jackoId],
      })
      .set('Authorization', 'Bearer ' + mikeToken)
      .expect(200);
  });

  it('/task/:id (PATCH), /task/:id (PATCH), update jacko task enlisting mike using an access token for the jacko user', () => {
    return request(server)
      .patch(`/task/${jackoTaskId}`)
      .send({
        enlisted: [mikeId],
      })
      .set('Authorization', 'Bearer ' + jackoToken)
      .expect(200);
  });

  it('list mike tasks using an access token for the user', () => {
    return request(server)
      .get(`/customer/${mikeId}/tasks`)
      .set('Authorization', 'Bearer ' + mikeToken)
      .expect(200)
      .expect(function (res) {
        res.body.results.length = 2;
      });
  });

  it('list jacko tasks using an access token for the user', () => {
    return request(server)
      .get(`/customer/${jackoId}/tasks`)
      .set('Authorization', 'Bearer ' + jackoToken)
      .expect(200)
      .expect(function (res) {
        res.body.results.length = 2;
      });
  });

  // no authentication

  it('/task (POST), register a task but no access token (FORBIDDEN)', () => {
    return request(server)
      .post('/task')
      .send({
        label: 'danielle task',
        description: 'this is the danielle task',
      })
      .expect(403);
  });

  it('/task (POST), register a task using access token but customer not registered (FORBIDDEN)', () => {
    return request(server)
      .post('/task')
      .set('Authorization', 'Bearer ' + danielleToken)
      .send({
        label: 'danielle task',
        description: 'this is the danielle task',
      })
      .expect(403);
  });

  it('/task/:id (PATCH), update mike task status no access token (FORBIDDEN)', () => {
    return request(server)
      .patch(`/task/${mikeTaskId}`)
      .send({
        status: TaskStatus.RUNNING,
      })
      .expect(403);
  });

  it('/task/:id (PATCH), update jacko task status no access token (FORBIDDEN)', () => {
    return request(server)
      .patch(`/task/${jackoTaskId}`)
      .send({
        status: TaskStatus.RUNNING,
      })
      .expect(403);
  });

  it('/task/:id (PATCH), update mike task status using access token but customer not registered (FORBIDDEN)', () => {
    return request(server)
      .patch(`/task/${mikeTaskId}`)
      .set('Authorization', 'Bearer ' + danielleToken)
      .send({
        status: TaskStatus.RUNNING,
      })
      .expect(403);
  });

  it('/task/:id (PATCH), update jacko task status using access token but customer not registered (FORBIDDEN)', () => {
    return request(server)
      .patch(`/task/${jackoTaskId}`)
      .set('Authorization', 'Bearer ' + danielleToken)
      .send({
        status: TaskStatus.RUNNING,
      })
      .expect(403);
  });

  // update task

  it('/task/:id (PATCH), update mike task status using mike access token', () => {
    return request(server)
      .patch(`/task/${mikeTaskId}`)
      .set('Authorization', 'Bearer ' + mikeToken)
      .send({
        status: TaskStatus.RUNNING,
      })
      .expect(200)
      .expect(function (res) {
        res.body.status = TaskStatus.RUNNING;
      });
  });

  it('/task/:id (PATCH), update mike task status using jacko access token', () => {
    return request(server)
      .patch(`/task/${mikeTaskId}`)
      .set('Authorization', 'Bearer ' + jackoToken)
      .send({
        status: TaskStatus.DONE,
      })
      .expect(200)
      .expect(function (res) {
        res.body.status = TaskStatus.DONE;
      });
  });

  it('/task/:id (PATCH), update jacko task status using jacko access token', () => {
    return request(server)
      .patch(`/task/${jackoTaskId}`)
      .set('Authorization', 'Bearer ' + jackoToken)
      .send({
        status: TaskStatus.RUNNING,
      })
      .expect(200)
      .expect(function (res) {
        res.body.status = TaskStatus.RUNNING;
      });
  });

  it('/task/:id (PATCH), update jacko task status using mike access token', () => {
    return request(server)
      .patch(`/task/${jackoTaskId}`)
      .set('Authorization', 'Bearer ' + mikeToken)
      .send({
        status: TaskStatus.DONE,
      })
      .expect(200)
      .expect(function (res) {
        res.body.status = TaskStatus.DONE;
      });
  });

  // delete task

  it('/task/:id (DELETE), delete mike task using jacko access token (FORBIDDEN)', () => {
    return request(server)
      .delete(`/task/${mikeTaskId}`)
      .set('Authorization', 'Bearer ' + jackoToken)
      .expect(403);
  });

  it('/task/:id (DELETE), delete jacko task using mike access token (FORBIDDEN)', () => {
    return request(server)
      .delete(`/task/${jackoTaskId}`)
      .set('Authorization', 'Bearer ' + mikeToken)
      .expect(403);
  });

  it('/task/:id (DELETE), delete mike task using mike access token (FORBIDDEN)', () => {
    return request(server)
      .delete(`/task/${mikeTaskId}`)
      .set('Authorization', 'Bearer ' + mikeToken)
      .expect(200);
  });

  it('/task/:id (DELETE), delete jacko task using jacko access token (FORBIDDEN)', () => {
    return request(server)
      .delete(`/task/${jackoTaskId}`)
      .set('Authorization', 'Bearer ' + jackoToken)
      .expect(200);
  });
});
