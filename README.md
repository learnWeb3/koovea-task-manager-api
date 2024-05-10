## koovea-task-manager-api

This repository contains the code related to the koovea-task-manager api

Application is hosted and accessible [here](https://api.koovea.ticketing.students-epitech.ovh/swagger)

A frontend interface is available [here](https://koovea.ticketing.students-epitech.ovh) and delivers a jwt access token to be used for authentication purpose.

## Registered users

- email: mike@yopmail.com
  password: foobar

- email: jacko@yopmail.com
  password: foobar

Registration is enabled and grants you the default user role to access the koovea-task-mnager-api !

## Goals:

Develop a REST server for task management.

Users should be able to read, create, update, and delete tasks.
Only logged-in users can create tasks and associate other users with them.
Users associated with a task can only read or modify it, while only owners can delete it.

## Instructions

- Create a NestJs application and integrate MongoDB for data management. [OK]
- Set up data models for users and tasks, allowing multiple users to be associated with a task. [OK]
- Implement necessary endpoints according to the following specifications:
  - Logged-in users can create new tasks and associate other users with these tasks. [OK]
  - Users associated with a task have the right to view and update that task. [OK]
  - Only task owners have the privilege to delete them. [OK]
  - (Bonus) Dockerize your application to facilitate its deployment. [OK]
  - [Extra Bonus] Docker compose file with mongo and keycloak available
  - [Extra Bonus] Auto generated swagger (OPENAPI standard) documentation
  - (Extra Bonus) End to end test setup
  - (Extra Bonus) Test, Tag, Build, Push pipeline setup for staging + main branch
  - [Extra Bonus] Deployed accessible application over the internet
  - [Extra Bonus] User authentication and authorization granted by a third party server (keycloak)
- The project's source code must be accessible online, for example, on a source code management platform like Github, Gitlab, or BitBucket.

## Quick start (development)

```bash
# build the images
docker compose build
# start up the docker containers
docker compose up -d
# wait until all containers are healthy (approx 1 minutes)
docker ps
```

1. Get an acces token by visiting the frontend http://localhost:3001

2. Login using the following users or registering a new one :

- email: mike@yopmail.com
  password: foobar

- email: jacko@yopmail.com
  password: foobar

3. test the api by visiting the backend and using the swagger documentation http://localhost:3000/swagger and using the following credentials

- id: swagger
  password: 1lO4Ko3pbZI1

## Quick start (production)

1. Get an acces token by visiting the frontend https://koovea.ticketing.students-epitech.ovh

2. Login using the following users or registering a new one :

- email: mike@yopmail.com
  password: foobar

- email: jacko@yopmail.com
  password: foobar

3. test the api by visiting the backend and using the swagger documentation https://api.koovea.ticketing.students-epitech.ovh/swagger and using the following credentials

- id: swagger
  password: 1lO4Ko3pbZI1

## APIs documentation

Documentation is secured using basic authentication using the following credentials:

Online documentation available [here](https://api.koovea.ticketing.students-epitech.ovh/swagger)

ID: swagger
PASSWORD: "1lO4Ko3pbZI1"

## Mongo

A root user is configured and given root permissions.
A specific database is created for the koovea-task-manager-api webservice and a specific user with readWrite role access to the database (only readWrite for security sake) is created using the docker-entrypoint-initdb.js mounted as a volume.

## Keycloak

```bash
# export a realm form a file
/opt/keycloak/bin/kc.sh export --file /opt/keycloak/backup/2024-04.05.json
# import a realm from a file
/opt/keycloak/bin/kc.sh import --file /opt/keycloak/backup/2024-04.05.json
```

Initial configuration is mounted as a volume from an exported realm file it includes basic setup for development purposes of 2 clients, the koovea-task-manager-api private openid connect client and the koovea-public-app client public openid connect client. The koovea-task-manager-api client has configured "user" client role wich is then referenced by a koovea-task-manager-user realm role for ease of use and reproducability. This realm role is included as a default role for the koovea ralm.

WWarning: The configuration enables direct access grant for end to end test and is not suitable for production environment.

A keycloak image including command and arguments as been build and is available [here](https://hub.docker.com/repository/docker/antoineleguillou/keycloak-dev) to overcome github service container limitations on command argument.

## Koovea task manager client

This client is developped only for the purpose of setting up the authentication flow using the Oauth2 authorization code grant flow (redirection based).
This client implements the [@axa-fr/react](https://github.com/AxaFrance/oidc-client/tree/main/packages/react-oidc#readme.md) openid connect client library.

## Docker (Development)

In order to startup the project using docker you need to have docker daemon and client + docker compose installed on your computer. Please go to the official documentation in order to install it if it is not available on your system. Usally one would install docker desktop distribution for development purposes.

```bash
# check if docker is version
docker --version
# Go root of this directory
cd /path/to/the/project
# startup docker container
docker compose up -d
```

Volume are specified as directory and will be created upon startup. Better storage solutions might be configured according to the environnement.

Image are made available as public image in the antoineleguillou/koovea-task-manager-api [dockerhub repository](https://hub.docker.com/repository/docker/antoineleguillou/koovea-task-manager-api) due to cost limitations. A private repository would be more secured and guarantee code privacy.

Docker compose is convenient here as we want to startup (runtime) multiple services from a single command with specific networks, volumes and environnement variables configurations wich would be really verbose otherwise.
You can find the configuration file [here](./docker-compose.yml).

## Kubernetes (Production)

As the setup goes a little beyond the scope of this project and might be complex to use in development I have chosen to deploy everything to production including an authentication required frontend web client in order to print the access token obtained from keycloak.

[Api has been made available here](https://api.koovea.ticketing.students-epitech.ovh)
[Front end client has been made available here](https://api.koovea.ticketing.students-epitech.ovh)

## CI/CD

A build pipeline is setup using github actions and automatically test, tag, build and push a docker image to the [antoineleguillou/koovea-task-manager-api dockerhub repository](https://hub.docker.com/repository/docker/antoineleguillou/koovea-task-manager-api/general) on the main and staging branch.
On staging branch the image tag would be prefixed with the 'staging' word. It allows to handle properly staging and production image releases.
