import { Batch } from './Batch';
import { Stock } from './Stock';

export type BatchWithStocks = {
  batch: Batch;
  stocks: Array<Stock>;
};
