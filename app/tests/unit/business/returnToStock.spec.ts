/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon from 'sinon';
import { ReturnToStock } from '../../../src/business/returnToStock';
import { StockRepository } from '../../../src/repositories/stock';
import { EventBus } from '../../../src/services/EventBus';

describe('Business -> return_to_stock', async () => {
  let return_to_stock: ReturnToStock;
  let return_to_stock_stub: sinon.SinonStub;
  let pub: sinon.SinonStub;

  beforeEach(() => {
    sinon.restore();
    return_to_stock_stub = sinon.stub(StockRepository.prototype, 'returnToStock');
    return_to_stock = new ReturnToStock({ prisma: {}, logger: {}, event_bus: '', aws_params: {} } as any);
    pub = sinon.stub(EventBus.prototype, 'pub').resolves();
  });

  it('should return to stock', async () => {
    const stock_ids = [1];
    const stocks = { product_id: '1', quantity: 1 };
    return_to_stock_stub.resolves(stocks);
    pub.resolves();
    const result = await return_to_stock.sell(stock_ids);
    expect(result).deep.equal(undefined);
    expect(pub.args[0][0]).deep.equal({ stocks });
  });
});
