FROM node:12.18.2

# install pm2 process manager package
RUN npm install pm2@latest --global --quiet

# create directory for the container
WORKDIR /home/nodejs/app

# only copy package.json file to work dir
COPY . /home/nodejs/app
# install packages
RUN npm install

# build with tsc
RUN npm run build

# copy build folder with app to work dir
# ADD ./build /home/hodejs/app

# expose PORT
EXPOSE 3000

CMD ["pm2-runtime", "./pm2/pm2.json"]
