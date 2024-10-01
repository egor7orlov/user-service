FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm i
COPY --chown=node:node . .
CMD ["npm", "run", "dev"]
