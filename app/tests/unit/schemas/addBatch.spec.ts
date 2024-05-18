import { expect } from 'chai';
import { Validator } from '../../../src/adapters/validate';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { create_batch_schema } from '../../../src/schemas/addBatch';
import { BatchData } from '../../data/batch';
import { ProductData } from '../../data/product';

describe('Schema -> AddBatch', async () => {
  it('Should validate schema', async () => {
    const data = BatchData.create();
    const result = await Validator.validate(data, create_batch_schema);
    expect(result).deep.eq(data);
  });
  it('Should not validate schema', async () => {
    const product_id = ProductData._id();
    const result = await Validator.validate({ product_id, quantity: 0 }, create_batch_schema).catch((e) => e);
    expect(result).instanceOf(ValidationError);
    expect(result.issues).deep.eq({ quantity: ['Number must be greater than 0'] });
  });
});
