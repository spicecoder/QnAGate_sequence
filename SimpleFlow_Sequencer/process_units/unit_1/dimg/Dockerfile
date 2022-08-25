FROM node 

# Create app directory
WORKDIR /usr/src/app
# This can be overridden at run time
ENV libv sharp
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY p_rotate.js .
EXPOSE 8080
ENTRYPOINT ["node", "p_rotate.js"]
CMD ["angle=150"]