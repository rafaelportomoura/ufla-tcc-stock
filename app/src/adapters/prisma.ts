/* eslint-disable no-use-before-define */
import { PrismaClient } from '@prisma/client';

export class PrismaStatic {
  private static instance: PrismaClient;

  static create(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient();
    }

    return this.instance;
  }
}
