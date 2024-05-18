/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon from 'sinon';
import { ListBalance } from '../../../src/business/listBalance';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { StockRepository } from '../../../src/repositories/stock';

describe('Business -> listBalance', async () => {
  let count_distinct: sinon.SinonStub;
  let get_balance: sinon.SinonStub;
  let list_balance: ListBalance;
  beforeEach(() => {
    sinon.restore();
    count_distinct = sinon.stub(StockRepository.prototype, 'countDistinctProductIds');
    get_balance = sinon.stub(StockRepository.prototype, 'getBalanceGroupedByProducts');
    list_balance = new ListBalance({ prisma: {} } as any);
  });
  it('should list balance', async () => {
    const params = { page: 1, size: 10 };
    const balance = [{ product_id: '1', quantity: 1 }];
    get_balance.resolves(balance);
    count_distinct.resolves(1);
    const result = await list_balance.list(params);
    expect(result).deep.equal({ page: 1, pages: 1, count: 1, products_balance: result });
  });
  it('should not list balance', async () => {
    const params = { page: 2, size: 10 };
    const balance = [{ product_id: '1', quantity: 1 }];
    get_balance.resolves(balance);
    count_distinct.resolves(10);
    const result = await list_balance.list(params).catch((e) => e);
    expect(result).deep.equal(new NotFoundError(CODE_MESSAGES.INVALID_PAGE));
  });
});
