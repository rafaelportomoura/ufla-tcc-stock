/* eslint-disable no-use-before-define */
import { Prisma, PrismaClient } from '@prisma/client';
import { RDS } from '../database/rds';
import { AwsParams } from '../types/Aws';

type Options = Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions>;

export class PrismaStatic extends PrismaClient {
  private static instance: PrismaStatic;

  private constructor(options?: Options) {
    super(options);
  }

  static async create(aws_params: AwsParams): Promise<PrismaStatic> {
    if (!this.instance) {
      const rds = new RDS(aws_params);
      const database_url = await rds.getDatabaseUrl();
      this.instance = new PrismaStatic({ datasources: { db: { url: database_url } } });
    }

    return this.instance;
  }

  static get(): PrismaStatic {
    return this.instance;
  }
}
