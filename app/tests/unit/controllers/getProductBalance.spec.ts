import { expect } from 'chai';
import { FastifyReply } from 'fastify';
import sinon from 'sinon';
import { GetBalance } from '../../../src/business/getBalance';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { getProductBalance } from '../../../src/controllers/getProductBalance';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';

describe('Controller -> GetProductBalance', async () => {
  let get_product_balance: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const handler = (params: Record<string, unknown>) =>
    getProductBalance(fastify_request({ params }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    get_product_balance = sinon.stub(GetBalance.prototype, 'getBalance');
    res = fastify_stub();
  });
  it('should get product balance', async () => {
    const balance = { product_id: '1', balance: 1 };
    get_product_balance.resolves(balance);
    const response = await handler({ product_id: '1' });
    expect(res.status.args).deep.equal([]);
    expect(response).deep.equal(balance);
  });
  it('should not get product balance', async () => {
    get_product_balance.rejects(new Error());
    const response = await handler({ product_id: '1' });
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  });
});
