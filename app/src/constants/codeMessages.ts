import { StockIdentifier } from '../types/Stock';
import { CONFIGURATION } from './configuration';

const prefix = (code: number) => `${CONFIGURATION.MICROSERVICE}-${String(code).padStart(4, '0')}`;

let n = 0;

export const CODE_MESSAGES = {
  INTERNAL_SERVER_ERROR: {
    code: prefix(n++),
    message: 'Internal Server Error!'
  },
  CANNOT_ACCESS_DATABASE: {
    code: prefix(n++),
    message: 'Cannot access database!'
  },
  VALIDATION_ERROR: {
    code: prefix(n++),
    message: 'Validation Error!'
  },
  PRODUCT_NOT_FOUND: {
    code: prefix(n++),
    message: 'Product not found!'
  },
  ERROR_CALLING_PRODUCT_API: {
    code: prefix(n++),
    message: 'Error when call product api!'
  },
  NOT_ENOUGH_ITEMS: {
    code: prefix(n++),
    message: 'Not enough items!'
  },
  CREATED_BATCH: {
    code: prefix(n++),
    message: 'Successfully added batch to stock!'
  },
  RESERVED: {
    code: prefix(n++),
    message: 'Reserved!'
  },
  INVALID_PAGE: {
    code: prefix(n++),
    message: 'Page out of range!'
  },
  ITEMS_ALREADY_BEEN_SOLD: (items: Array<StockIdentifier>) => ({
    code: prefix(n++),
    message: 'The following items have already been sold!',
    items
  }),
  ITEMS_ARE_NOT_RESERVED: (items: Array<StockIdentifier>) => ({
    code: prefix(n++),
    message: 'The following items are not reserved!',
    items
  }),
  UNAUTHORIZED: {
    code: prefix(n++),
    message: 'Unauthorized!'
  },
  FORBIDDEN: {
    code: prefix(n++),
    message: "User can't access this resource!"
  }
} as const;
