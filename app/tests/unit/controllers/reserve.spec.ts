import { expect } from 'chai';
import { FastifyReply } from 'fastify';
import sinon from 'sinon';
import { ReserveStock } from '../../../src/business/reserve';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { reserve } from '../../../src/controllers/reserve';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';

describe('Controller -> Reserve', async () => {
  let reserve_stock: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const handler = (body: Record<string, unknown>) => reserve(fastify_request({ body }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    reserve_stock = sinon.stub(ReserveStock.prototype, 'reserve');
    res = fastify_stub();
  });
  it('should reserve stock', async () => {
    const stock = { product_id: '1', quantity: 1 };
    reserve_stock.resolves(stock);
    const response = await handler({ products: { '1': 1 } });
    expect(res.status.args).deep.equal([[201]]);
    expect(response).deep.equal({ ...CODE_MESSAGES.RESERVED, reserves: stock });
  });
  it('should not reserve stock', async () => {
    reserve_stock.rejects(new Error());
    const response = await handler({ products: { '1': 1 } });
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  });
});
