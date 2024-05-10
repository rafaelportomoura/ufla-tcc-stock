/* eslint-disable no-console */
import FastifyCors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import qs from 'fastify-qs';

import { StatusCodes } from 'http-status-codes';
import { CONFIGURATION } from '../constants/configuration';

import { router } from '../routes';

export async function main(prisma: PrismaClient) {
  const server = Fastify({
    logger: {
      level: 'silent'
    }
  });
  server.register(qs, {});
  server.register(FastifyCors, {
    origin: '*',
    allowedHeaders: '*',
    methods: '*'
  });

  server.decorate('prisma', prisma);

  server.get('/health-check', (_, res) => res.status(StatusCodes.OK).send('alive'));

  server.register(router);

  server.listen(
    {
      port: CONFIGURATION.PORT,
      host: '0.0.0.0'
    },
    (err, addr) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.info(`RUNNING ON PORT ${addr}`);
    }
  );
}

if (CONFIGURATION.STAGE !== 'development')
  (async () => {
    const prisma = new PrismaClient();
    await main(prisma);
  })();
