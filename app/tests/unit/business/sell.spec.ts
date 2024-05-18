import { expect } from 'chai';
/* eslint-disable @typescript-eslint/no-explicit-any */
import sinon from 'sinon';
import { Sell } from '../../../src/business/sell';
import { StockRepository } from '../../../src/repositories/stock';
import { EventBus } from '../../../src/services/EventBus';

describe('Business -> Sell', async () => {
  let sell: Sell;
  let sell_stock: sinon.SinonStub;
  let pub: sinon.SinonStub;

  beforeEach(() => {
    sinon.restore();
    sell_stock = sinon.stub(StockRepository.prototype, 'sell');
    pub = sinon.stub(EventBus.prototype, 'pub').resolves();
    sell = new Sell({ prisma: {}, logger: {}, event_bus: '', aws_params: {} } as any);
  });

  it('should sell stock', async () => {
    const params = [1];
    const stocks = [{ product_id: '1', quantity: 1 }];
    sell_stock.resolves(stocks);
    const result = await sell.sell(params);
    expect(result).deep.equal(undefined);
    expect(pub.args[0][0]).deep.equal({ stocks });
  });
});
