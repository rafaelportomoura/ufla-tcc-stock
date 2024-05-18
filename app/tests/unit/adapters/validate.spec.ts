import { expect } from 'chai';
import { Validator } from '../../../src/adapters/validate';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { create_batch_schema } from '../../../src/schemas/addBatch';
import { ProductData } from '../../data/product';

describe('Adapters -> Validate', async () => {
  it('Should validate schema', async () => {
    const product_id = ProductData._id();
    const result = await Validator.validate({ product_id, quantity: 1 }, create_batch_schema);
    expect(result).deep.eq({ product_id, quantity: 1 });
  });
  it('Should not validate schema', async () => {
    const result = await Validator.validate({ product_id: 1, quantity: 1 }, create_batch_schema).catch((e) => e);
    expect(result).instanceOf(ValidationError);
    expect(result.issues).deep.eq({ product_id: ['Expected string, received number'] });
  });
});
