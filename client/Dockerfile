# ---------- BUILD STAGE ----------
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env* ./

COPY . .


RUN npm run build

# ---------- RUN STAGE ----------
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
    