import { expect } from 'chai';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { BaseError } from '../../../src/exceptions/BaseError';
import { ConflictError } from '../../../src/exceptions/ConflictError';

const name = 'ConflictError';
describe(`Exception -> ${name}`, async () => {
  const error = new ConflictError(CODE_MESSAGES.NOT_ENOUGH_ITEMS);
  it(`Should create a ${name}`, () => expect(error).to.be.instanceOf(ConflictError));
  it(`Should create a ${name} child of BaseError`, () => expect(error).to.be.instanceOf(BaseError));
  it(`Should have the correct name`, () => expect(error.name).eq(name));
  it(`Should have the correct status`, () => expect(error.status).eq(409));
  it(`Should have the correct code`, () => expect(error.code).eq(CODE_MESSAGES.NOT_ENOUGH_ITEMS.code));
  it(`Should have the correct message`, () => expect(error.message).eq(CODE_MESSAGES.NOT_ENOUGH_ITEMS.message));
  it(`Should have the correct toJSON`, () =>
    expect(error.toJSON()).deep.eq({
      code: CODE_MESSAGES.NOT_ENOUGH_ITEMS.code,
      error: name,
      message: CODE_MESSAGES.NOT_ENOUGH_ITEMS.message
    }));
  it(`Should have the correct stack`, () => expect(error.stack).to.be.a('string'));
  it(`Should have the correct toString`, () =>
    expect(error.toString()).eq(`${name}: ${CODE_MESSAGES.NOT_ENOUGH_ITEMS.message}`));
});
