FROM node:20.11.0-alpine3.18
WORKDIR /home/node
USER node
COPY --chown=node:node server server
COPY --chown=node:node tf tf
RUN npm --prefix ./server install
EXPOSE 8080
CMD ["npm", "start"]