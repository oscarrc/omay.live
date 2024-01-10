FROM alpine:latest
COPY . /videochat
WORKDIR /videochat
RUN npm run install && npm run build && mv /videochat/app/dist /videochat/www && rm -r app
ENV NODE_ENV production
EXPOSE 8080
CMD ["npm", "start"]