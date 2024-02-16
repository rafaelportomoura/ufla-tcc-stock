import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { createBatch } from '../controllers/createBatch';
import { getBatchBalance } from '../controllers/getBatchBalance';
import { getProductBalance } from '../controllers/getProductBalance';
import { reserve } from '../controllers/reserve';

export function router(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.post('/batch', createBatch);
  server.post('/reserve', reserve);
  server.get('/balance/product/:product_id', getProductBalance);
  server.get('/balance/batch/:batch_id', getBatchBalance);
  done();
}
