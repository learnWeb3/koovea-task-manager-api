FROM node:20.9.0-alpine3.17 As builder

WORKDIR /usr/share/app/

RUN npm i --global @nestjs/cli

COPY package.json ./

RUN npm install --verbose

COPY . .

RUN npm run build


FROM node:20.9.0-alpine3.17 As production

RUN apk update && apk add --no-cache tini 

WORKDIR /usr/share/app/

COPY --from=builder /usr/share/app/node_modules ./node_modules
COPY --from=builder /usr/share/app/dist ./dist

ENTRYPOINT ["/sbin/tini", "--"]

EXPOSE 3000

CMD ["node", "/usr/share/app/dist/main.js"]