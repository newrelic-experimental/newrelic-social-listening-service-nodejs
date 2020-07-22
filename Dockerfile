FROM node:12.18.2

# install pm2 process manager package
RUN npm install pm2@latest --global --quiet

# create directory for the container
WORKDIR /home/nodejs

# only all files to work dir
COPY . .

# install packages
RUN npm install

# expose PORT
EXPOSE 3000
