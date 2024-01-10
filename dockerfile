FROM alpine:latest
WORKDIR /lamdazle
COPY . .
RUN npm run build && mv /lamdazle/app/dist /lamdazle/www && rm -r app
CMD ["npm", "start"]