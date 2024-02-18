FROM node:20-alpine3.18

ADD ["./package.json", "package.json"]
ADD ["./tsconfig.json", "tsconfig.json"]
ADD ["./dist", "dist"]

RUN npm install -g pnpm tsx
RUN pnpm install --ignore-scripts --prod --no-optional
RUN find ./node_modules -mtime +10950 -exec touch {} +

RUN chmod 777 dist
RUN chmod 777 dist/*
RUN chmod 777 package.json

CMD [ "node", "dist/handlers/server.js" ]
