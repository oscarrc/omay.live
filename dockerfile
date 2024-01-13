FROM node:20.11.0-alpine3.18
WORKDIR /home/node/app
USER node
COPY --chown=node:node . .
RUN npm run install && npm run build
USER 0
RUN mv /home/node/app/app/dist /home/node/app/www && rm -r /home/node/app/app/
ENV NODE_ENV production
USER node
EXPOSE 8080
CMD ["npm", "start"]