import { expect } from 'chai';
import { FastifyReply } from 'fastify/types/reply';
import sinon from 'sinon';
import { ListBalance } from '../../../src/business/listBalance';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { listBalance } from '../../../src/controllers/listBalance';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';

describe('Controller -> ListBalance', async () => {
  let list_balance: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const handler = (params: Record<string, unknown>) => listBalance(fastify_request({ params }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    list_balance = sinon.stub(ListBalance.prototype, 'list');
    res = fastify_stub();
  });
  it('should list balance', async () => {
    const balance = [{ product_id: '1', balance: 1 }];
    list_balance.resolves(balance);
    const response = await handler({});
    expect(res.status.args).deep.equal([]);
    expect(response).deep.equal(balance);
  });
  it('should not list balance', async () => {
    list_balance.rejects(new Error());
    const response = await handler({});
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  });
});
