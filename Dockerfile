FROM node:16-alpine
WORKDIR /app
COPY ./src/package*.json ./
RUN npm install
RUN mkdir -p node_modules/.vite && chmod -R 777 node_modules/.vite
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
