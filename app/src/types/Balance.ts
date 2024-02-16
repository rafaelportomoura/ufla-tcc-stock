import { StockStatus } from '@prisma/client';

export type Balance = {
  [key in Lowercase<StockStatus>]: number;
};

export type BalanceKeys = keyof Balance;
