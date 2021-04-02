FROM node:10-alpine AS builder

WORKDIR /app

COPY ./package.json ./yarn.lock /app/

RUN yarn install

COPY . /app/

RUN yarn run build

FROM node:10-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY ./package.json ./yarn.lock /app/

RUN yarn install --prod

COPY . .

COPY --from=builder /app/dist ./dist

CMD ["yarn", "run", "start:prod"]