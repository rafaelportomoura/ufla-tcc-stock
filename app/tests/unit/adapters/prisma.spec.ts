/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { PrismaClient } from '@prisma/client';
import { expect } from 'chai';
import sinon from 'sinon';
import { PrismaStatic } from '../../../src/adapters/prisma';

describe('Adapter -> Prisma', async () => {
  beforeEach(() => {
    sinon.restore();
    sinon.stub(PrismaClient, <any>'constructor').returns({} as any);
  });
  it('should create a a prisma client', async () => {
    PrismaStatic['instance'] = undefined as any;
    expect(PrismaStatic['instance']).equal(undefined);
    const prisma = PrismaStatic.create();
    expect(prisma).instanceOf(PrismaClient);
  });
  it('should return a prisma client', async () => {
    const prisma = PrismaStatic.create();
    expect(PrismaStatic.create()).equal(prisma);
  });
});
