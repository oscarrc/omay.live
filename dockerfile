FROM alpine:latest
WORKDIR /lamdazle
COPY server server
COPY /app/dist app
WORKDIR /lamdazle/server
RUN npm install
ENV NODE_ENV production
CMD ["npm", "start"]