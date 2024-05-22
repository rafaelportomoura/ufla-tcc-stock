import { expect } from 'chai';
import { FastifyReply, FastifyRequest } from 'fastify';
import sinon from 'sinon';
import { GetBalance } from '../../../src/business/getBalance';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { getBatchBalance } from '../../../src/controllers/getBatchBalance';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';

describe('Controller -> getBatchBalance', async () => {
  let get_batch_balance: sinon.SinonStub;
  let req: FastifyRequest;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;

  beforeEach(() => {
    sinon.restore();
    get_batch_balance = sinon.stub(GetBalance.prototype, 'getBalance');
    req = fastify_request({
      params: { batch_id: '1' }
    });
    res = fastify_stub();
  });

  it('should get batch balance', async () => {
    const balance = { batch_id: '1', balance: 1 };
    get_batch_balance.resolves(balance);
    const response = await getBatchBalance(req, fastify_reply(res));
    expect(res.status.args).deep.equal([]);
    expect(response).deep.equal(balance);
  });

  it('should not get batch balance', async () => {
    get_batch_balance.rejects(new Error());
    const response = await getBatchBalance(req, fastify_reply(res));
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR).toJSON());
  });
});
