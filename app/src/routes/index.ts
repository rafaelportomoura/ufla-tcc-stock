import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { addStock } from '../controllers/add';

export function router(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.post('/', addStock);
  done();
}
