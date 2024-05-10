FROM node:20-alpine3.18

ADD ["./package.json", "package.json"]
ADD ["./tsconfig.json", "tsconfig.json"]
RUN sed -i '/"prepare": "husky install",/d' package.json
RUN npm install -g pnpm prisma@5.9.1 --loglevel=error
RUN pnpm install --prod --loglevel=error
RUN find ./node_modules -mtime +10950 -exec touch {} +

ADD ["./prisma", "prisma"]
RUN pnpm install prisma@5.9.1
RUN pnpm prisma generate

ADD ["./dist", "dist"]
RUN chmod 777 dist
RUN chmod 777 dist/*
RUN chmod 777 package.json

CMD [ "pnpm", "run", "container" ]
