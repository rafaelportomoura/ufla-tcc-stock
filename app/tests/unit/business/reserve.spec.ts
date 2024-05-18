/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon from 'sinon';
import { ReserveStock } from '../../../src/business/reserve';
import { StockRepository } from '../../../src/repositories/stock';
import { EventBus } from '../../../src/services/EventBus';

describe('Business -> Reserve', async () => {
  let reserve: ReserveStock;
  let reserve_stock: sinon.SinonStub;
  let pub: sinon.SinonStub;

  beforeEach(() => {
    sinon.restore();
    reserve_stock = sinon.stub(StockRepository.prototype, 'reserve');
    pub = sinon.stub(EventBus.prototype, 'pub').resolves();
    reserve = new ReserveStock({ prisma: {}, logger: {}, event_bus: '', aws_params: {} } as any);
  });

  it('should reserve stock', async () => {
    const params = { products: { '1': 1 } };
    const stock = { product_id: '1', quantity: 1 };
    reserve_stock.resolves(stock);
    const result = await reserve.reserve(params);
    expect(result).deep.equal(stock);
  });
});
