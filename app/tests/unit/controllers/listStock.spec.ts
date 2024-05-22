import { expect } from 'chai';
import { FastifyReply } from 'fastify/types/reply';
import sinon from 'sinon';
import { ListStock } from '../../../src/business/listStock';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { listStock } from '../../../src/controllers/listStock';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';

describe('Controller -> ListStock', async () => {
  let list_stock: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const handler = (params: Record<string, unknown>) => listStock(fastify_request({ params }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    list_stock = sinon.stub(ListStock.prototype, 'list');
    res = fastify_stub();
  });
  it('should list stock', async () => {
    const stock = [{ product_id: '1', quantity: 1 }];
    list_stock.resolves(stock);
    const response = await handler({});
    expect(res.status.args).deep.equal([]);
    expect(response).deep.equal(stock);
  });
  it('should not list stock', async () => {
    list_stock.rejects(new Error());
    const response = await handler({});
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR).toJSON());
  });
});
