#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:10-alpine AS builder

WORKDIR /app

COPY ./package.json ./yarn.lock tsconfig.json /app/

RUN yarn install

COPY . /app/

RUN yarn run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:10-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY ./package.json ./yarn.lock /app/

RUN yarn install --prod

COPY . .

## We just need the build to execute the command
COPY --from=builder /app/dist ./dist

CMD ["yarn", "run", "start"]