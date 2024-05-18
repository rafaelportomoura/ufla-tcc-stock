import { expect } from 'chai';
import sinon from 'sinon';
import { BatchData } from '../../data/batch';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '../../../src/adapters/logger';
import { aws_params } from '../../../src/aws/config';
import { CreateBatch } from '../../../src/business/createBatch';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { BatchStockRepository } from '../../../src/repositories/batchStock';
import { EventBus } from '../../../src/services/EventBus';
import { Products } from '../../../src/services/Products';

describe('Business -> CreateBatch', async () => {
  let batch_stock_repository: sinon.SinonStub;
  let product_exist: sinon.SinonStub;
  let create_batch: CreateBatch;
  let pub_event: sinon.SinonStub;
  beforeEach(() => {
    sinon.restore();
    product_exist = sinon.stub(Products.prototype, 'productExist');
    batch_stock_repository = sinon.stub(BatchStockRepository.prototype, 'create');
    pub_event = sinon.stub(EventBus.prototype, 'pub');
    create_batch = new CreateBatch({
      prisma: {} as any,
      logger: new Logger(LoggerLevel.silent, ''),
      product_base_url: '',
      aws_params: aws_params(),
      event_bus: '',
      request_id: ''
    });
  });
  it('should create a batch', async () => {
    const mock = { batch: { id: 1 }, stocks: { id: 2 } };
    batch_stock_repository.resolves(mock);
    product_exist.resolves(true);
    pub_event.resolves();
    const response = await create_batch.add(BatchData.create());
    expect(response).deep.equal(mock);
  });
  it('should not create a batch', async () => {
    product_exist.resolves(false);
    try {
      await create_batch.add(BatchData.create());
    } catch (error) {
      expect(error).deep.equal(new NotFoundError(CODE_MESSAGES.PRODUCT_NOT_FOUND));
    }
  });
});
