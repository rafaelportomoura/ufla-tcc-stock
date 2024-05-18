import { expect } from 'chai';
import sinon from 'sinon';
import { Api } from '../../../src/adapters/api';
import { Logger } from '../../../src/adapters/logger';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { Products } from '../../../src/services/Products';
import { Product } from '../../../src/types/Products';
import { ProductData } from '../../data/product';

describe('Service -> Product', async () => {
  let api_get: sinon.SinonStub;
  let products: Products;
  beforeEach(() => {
    sinon.restore();
    api_get = sinon.stub(Api.prototype, 'get');
    products = new Products({ base_url: 'base_url', logger: new Logger(LoggerLevel.silent, '') });
  });

  it('Should get product', async () => {
    const product = ProductData.product();
    api_get.resolves(product);

    const result = await products.get(product._id);

    expect(result).deep.eq(product);
    expect(api_get.args[0]).deep.equal([product._id, {}]);
  });
  it('Should get product with project', async () => {
    const _id = ProductData._id();
    api_get.resolves({ _id });

    const result = await products.get(_id, { _id: 1 });

    expect(result).deep.eq({ _id });
    expect(api_get.args[0]).deep.equal([_id, { project: { _id: 1 } }]);
  });
  it('Should throw not found error', async () => {
    const _id = ProductData._id();
    api_get.rejects({ response: { status: 404 } });

    const result = await products.get(_id).catch((e) => e);

    expect(result).instanceOf(NotFoundError);
    expect(result).deep.equal(new NotFoundError(CODE_MESSAGES.PRODUCT_NOT_FOUND));
  });
  it('Should throw internal server error', async () => {
    const _id = ProductData._id();
    api_get.rejects({ response: { status: 500 } });

    const result = await products.get(_id).catch((e) => e);

    expect(result).instanceOf(InternalServerError);
    expect(result).deep.equal(new InternalServerError(CODE_MESSAGES.ERROR_CALLING_PRODUCT_API));
  });
  it('Should check if product exists', async () => {
    const _id = ProductData._id();
    const product_get = sinon.stub(Products.prototype, 'get').resolves({ _id } as Product);

    const result = await products.productExist(_id);

    expect(result).equal(true);
    expect(product_get.args[0]).deep.equal([_id, { _id: 1 }]);
  });
  it('Should check if product does not exist', async () => {
    const _id = ProductData._id();
    const product_get = sinon
      .stub(Products.prototype, 'get')
      .rejects(new NotFoundError(CODE_MESSAGES.PRODUCT_NOT_FOUND));

    const result = await products.productExist(_id);

    expect(result).equal(false);
    expect(product_get.args[0]).deep.equal([_id, { _id: 1 }]);
  });
  it('Should throw error', async () => {
    const _id = ProductData._id();
    const product_get = sinon.stub(Products.prototype, 'get').rejects(new Error('Some error'));

    const result = await products.productExist(_id).catch((e) => e);

    expect(result).instanceOf(Error);
    expect(result).deep.equal(new Error('Some error'));
    expect(product_get.args[0]).deep.equal([_id, { _id: 1 }]);
  });
});
