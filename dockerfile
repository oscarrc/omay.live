FROM node:20.11.0-alpine3.18
WORKDIR /home/node/app
USER node
COPY --chown=node:node package.json package.json
COPY --chown=node:node server server
COPY --chown=node:node app app
RUN npm run install && npm run build
USER 0
RUN mv /home/node/app/app/dist /home/node/app/www && rm -r /home/node/app/app/
USER node
EXPOSE 8080
CMD ["npm", "start"]