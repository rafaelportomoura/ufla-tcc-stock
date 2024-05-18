import { createId } from '@paralleldrive/cuid2';
import { FastifyRequest } from 'fastify';

export const request_id = (req: FastifyRequest): string => (req.headers.request_id as string) ?? createId();
