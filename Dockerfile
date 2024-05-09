FROM node:20-alpine3.18

ADD ["./package.json", "package.json"]
ADD ["./tsconfig.json", "tsconfig.json"]
ADD ["./dist", "dist"]
ADD ["./prisma", "prisma"]
RUN sed -i '/"prepare": "husky install",/d' package.json
RUN npm install -g pnpm --loglevel=error
RUN pnpm install --prod --loglevel=error
RUN pnpm prisma generate
RUN find ./node_modules -mtime +10950 -exec touch {} +

RUN chmod 777 dist
RUN chmod 777 dist/*
RUN chmod 777 package.json

CMD [ "node", "dist/handlers/server.js" ]
