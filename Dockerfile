# Step 1: Use an official Node.js image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy the whole project
COPY . .

# Step 4: Install backend dependencies
RUN npm install

# Step 5: Install frontend dependencies and build React app
RUN npm install --prefix client && npm run build --prefix client

# Step 6: Expose backend port
EXPOSE 3000

# Step 7: Run the backend server
CMD ["node", "api/index.js"]
