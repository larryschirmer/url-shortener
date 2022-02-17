FROM mhart/alpine-node:16.4 as base

# include only folders/files that are needed for build
COPY ./tsconfig.json /app/tsconfig.json
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./src /app/src

WORKDIR /app
RUN npm install
RUN npm run build

FROM mhart/alpine-node:16.4
COPY --from=base /app/build /app/build
COPY package*.json /app/
WORKDIR /app
RUN npm install --only=prod

EXPOSE 1337
CMD ["npm", "start"]

# docker build -t larryschirmer/url-short:1.0.9 .
