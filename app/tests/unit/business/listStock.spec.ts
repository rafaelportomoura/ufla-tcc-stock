/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon from 'sinon';
import { ListStock } from '../../../src/business/listStock';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { StockRepository } from '../../../src/repositories/stock';

describe('Business -> ListStock', async () => {
  let count: sinon.SinonStub;
  let list: sinon.SinonStub;
  let list_stock: ListStock;

  beforeEach(() => {
    sinon.restore();
    count = sinon.stub(StockRepository.prototype, 'count');
    list = sinon.stub(StockRepository.prototype, 'listStock');
    list_stock = new ListStock({ prisma: {} } as any);
  });

  it('should list stock', async () => {
    const params = { page: 1, size: 10 };
    const stock = [{ product_id: '1', quantity: 1 }];
    list.resolves(stock);
    count.resolves(1);
    const result = await list_stock.list(params);
    expect(result).deep.equal({ page: 1, pages: 1, count: 1, products_stock: stock });
  });

  it('should not list stock', async () => {
    const params = { page: 2, size: 10 };
    const stock = [{ product_id: '1', quantity: 1 }];
    list.resolves(stock);
    count.resolves(10);
    const result = await list_stock.list(params).catch((e) => e);
    expect(result).deep.equal(new NotFoundError(CODE_MESSAGES.INVALID_PAGE));
  });
});
