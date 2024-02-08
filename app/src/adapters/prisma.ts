/* eslint-disable no-use-before-define */
import { Prisma, PrismaClient } from '@prisma/client';

type Options = Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions>;

export class PrismaStatic extends PrismaClient {
  private static instance: PrismaStatic;

  private constructor(options?: Options) {
    super(options);
  }

  static create(options?: Options): PrismaStatic {
    if (!this.instance) this.instance = new PrismaStatic(options);

    return this.instance;
  }
}
