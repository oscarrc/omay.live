FROM node:20.11.0-alpine3.18
WORKDIR /home/node
USER node
COPY --chown=node:node package.json package.json
COPY --chown=node:node server server
COPY --chown=node:node tf tf
COPY --chown=node:node app app
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL ${VITE_SERVER_URL}
ENV VITE_DOCKER true
RUN npm run install && npm run build
USER 0
RUN rm -r /home/node/app
USER node
EXPOSE 8080
CMD ["npm", "start"]