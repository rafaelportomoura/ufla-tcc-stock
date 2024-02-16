import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { createBatch } from '../controllers/createBatch';
import { getBatchBalance } from '../controllers/getBatchBalance';
import { getProductBalance } from '../controllers/getProductBalance';

export function router(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.post('/batch', createBatch);
  server.get('/balance/product/:product_id', getProductBalance);
  server.get('/balance/batch/:batch_id', getBatchBalance);
  done();
}
