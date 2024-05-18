/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon from 'sinon';
import { PrismaStatic } from '../../../src/adapters/prisma';
import { ReturnToStock } from '../../../src/business/returnToStock';
import { returnToStock } from '../../../src/handlers/returnToStock';
import { SqsData } from '../../data/sqs';

describe('Handlers -> ReturnToStock', async () => {
  let return_to_stock_stub: sinon.SinonStub;
  const sns = (body: unknown) => returnToStock({ Records: [SqsData.record(SqsData.snsBody(body))] });
  const sqs = (body: unknown) => returnToStock({ Records: [SqsData.record(body)] });
  beforeEach(() => {
    sinon.restore();
    return_to_stock_stub = sinon.stub(ReturnToStock.prototype, 'return');
    sinon.stub(PrismaStatic, 'create').returns({ $connect() {}, $disconnect() {} } as any);
  });
  it('should return to stock', async () => {
    const stock_ids = [1];
    return_to_stock_stub.resolves();
    const response = await sns({ stock_ids });
    expect(response).deep.equal(undefined);
  });
  it('should not return to stock', async () => {
    const error = new Error();
    return_to_stock_stub.rejects(error);
    const response = await sqs({ stock_ids: [1] }).catch((e) => e);
    expect(response).deep.equal(error);
  });
});
