/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon from 'sinon';
import { GetBalance } from '../../../src/business/getBalance';
import { StockRepository } from '../../../src/repositories/stock';

describe('Business -> getBalance', async () => {
  let stock_repository: sinon.SinonStub;
  let get_balance;

  beforeEach(() => {
    stock_repository = sinon.stub(StockRepository.prototype, 'getBalance');
    get_balance = new GetBalance({ prisma: {} } as any);
  });

  it('should get balance', async () => {
    const where = { product_id: '1' };
    const balance = { product_id: '1', quantity: 1 };
    stock_repository.resolves(balance);
    const result = await get_balance.getBalance(where);
    expect(result).deep.equal(balance);
  });
});
