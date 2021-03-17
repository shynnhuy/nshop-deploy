FROM node:14.15.1

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./.yarnrc ./

RUN rm -rf node_modules/ && rm -rf yarn.lock
RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]