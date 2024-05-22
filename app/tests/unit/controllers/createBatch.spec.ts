import { expect } from 'chai';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import sinon from 'sinon';
import { CreateBatch } from '../../../src/business/createBatch';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { createBatch } from '../../../src/controllers/createBatch';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { BatchWithStocks } from '../../../src/types/BatchStock';
import { BatchData } from '../../data/batch';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';

describe('Controller -> createBatch', () => {
  let req: Partial<FastifyRequest>;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  beforeEach(() => {
    sinon.restore();
    req = fastify_request({
      body: BatchData.create()
    });

    res = fastify_stub();
  });

  it('should return 400 if request is not multipart', async () => {
    (req.body as Record<string, unknown>).product_id = undefined;
    const result = await createBatch(req as FastifyRequest, fastify_reply(res));

    expect(result).deep.equal(new ValidationError({ product_id: ['Required'] }).toJSON());
    expect(res.status.calledWith(StatusCodes.BAD_REQUEST)).equal(true);
  });

  it('should return 201 and image_id if image is added successfully', async () => {
    sinon.stub(CreateBatch.prototype, 'add').resolves({ batch: { id: 2 } } as unknown as BatchWithStocks);

    const result = await createBatch(req as FastifyRequest, fastify_reply(res));

    expect(result).deep.equal({ ...CODE_MESSAGES.CREATED_BATCH, batch_id: 2 });
    expect(res.status.calledWith(StatusCodes.CREATED)).equal(true);
  });
});
