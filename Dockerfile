FROM node:16.5.0-buster-slim



ENV NODE_ENV=development 
#ENV PORT=8000

COPY      . /var/www
WORKDIR   /var/www

RUN       npm install

#EXPOSE $PORT

#ENTRYPOINT ["npm", "start"]
