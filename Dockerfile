# # Step 1: Use an official Node.js image
# FROM node:20-alpine

# # Step 2: Set working directory
# WORKDIR /app

# # Step 3: Copy the whole project
# COPY . .

# # Step 4: Install backend dependencies
# RUN npm install

# # Step 5: Install frontend dependencies and build React app
# RUN npm install --prefix client && npm run build --prefix client

# # Step 6: Expose backend port
# EXPOSE 3000

# # Step 7: Run the backend server
# CMD ["node", "api/index.js"]



#

# # Step 1: Use an official Node.js image
# FROM node:20-alpine

# # Step 2: Set working directory
# WORKDIR /app

# # Step 3: Declare build arguments for environment variables
# ARG BACK_ENV
# ARG FRONT_ENV

# # Step 4: Set environment variables
# ENV BACK_ENV=${BACK_ENV}
# ENV FRONT_ENV=${FRONT_ENV}

# # Step 5: Copy the whole project
# COPY . .

# # Step 6: Install backend dependencies
# RUN npm install

# # Step 7: Install frontend dependencies and build React app
# RUN npm install --prefix client && npm run build --prefix client

# # Step 8: Expose backend port
# EXPOSE 3000

# # Step 9: Run the backend server
# CMD ["node", "api/index.js"]


#

# Dockerfile

# 1. Base image
FROM node:20-alpine

# 2. Create app directory
WORKDIR /app

# 3. Copy backend .env (for runtime) and all source
COPY .env ./
COPY package*.json ./
COPY api ./api

# 4. Install backend deps
RUN npm install

# 5. Copy frontend sources and its .env (for build)
COPY client /app/client
COPY client/.env /app/client/.env

# 6. Build frontend
WORKDIR /app/client
RUN npm install
RUN npm run build

# 7. Move build output back into the root and set working dir
WORKDIR /app
RUN mv client/dist ./public

# 8. Expose port and start backend
EXPOSE 3000
CMD ["node", "api/index.js"]
