/* eslint-disable no-use-before-define */
import { PrismaClient } from '@prisma/client';

export class PrismaStatic {
  private static instance: PrismaClient;

  static async create(): Promise<PrismaStatic> {
    if (!this.instance) {
      this.instance = new PrismaClient();
    }

    return this.instance;
  }

  static get(): PrismaClient {
    return this.instance;
  }
}
