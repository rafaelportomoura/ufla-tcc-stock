import { Batch } from './Batch';
import { Stock } from './Stock';

export type CreateBatchStockResponse = {
  batch: Batch;
  stocks: Array<Stock>;
};
