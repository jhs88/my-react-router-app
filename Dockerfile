FROM node:20-alpine AS build
WORKDIR /opt/react-router
COPY . .
RUN npm ci --silent && npm run build; \
    npm cache clean --force; \
    rm -rf node_modules

FROM node:20-alpine
WORKDIR /opt/react-router
COPY --from=build /opt/react-router/build /opt/react-router/build
COPY --from=build /opt/react-router/package*.json /opt/react-router/
EXPOSE 3000
CMD ["sh", "-c", "npm ci --silent --omit=dev && npm start"]
