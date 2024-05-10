/* eslint-disable no-console */
import { isEmpty } from 'lodash';
import { Client } from 'pg';
import qs from 'qs';
import { SecretsManager } from '../aws/secretsManager';
import { SSM } from '../aws/ssm';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { DatabaseError } from '../exceptions/DatabaseError';
import { AwsParams } from '../types/Aws';
import { RdsParams, RdsSecret } from '../types/RdsSecret';

export class RDS {
  private secret_manager: SecretsManager;

  private ssm: SSM;

  constructor(config: AwsParams) {
    this.secret_manager = new SecretsManager(config);
    this.ssm = new SSM(config);
  }

  async getDatabaseUrl(): Promise<string> {
    const secrets = await this.secret_manager.getSecret<RdsSecret>(CONFIGURATION.RDS_SECRET);
    const params = await this.ssm.getParams<RdsParams>(CONFIGURATION.RDS_PARAMS);

    const { username, password } = secrets;
    const { protocol, host, port, options } = params;

    const query = !isEmpty(options) ? `?${qs.stringify(options)}` : '';

    const uri = `${username}:${encodeURIComponent(password)}@${host}`;
    const database = CONFIGURATION.MICROSERVICE;

    return `${protocol}://${uri}/${database}${query}`;
  }

  async createDatabase() {
    const secrets = await this.secret_manager.getSecret<RdsSecret>(CONFIGURATION.RDS_SECRET);
    const params = await this.ssm.getParams<RdsParams>(CONFIGURATION.RDS_PARAMS);
    const database = CONFIGURATION.MICROSERVICE;

    const { username: user, password } = secrets;
    const { host } = params;
    const client = new Client({ user, password, host, database: 'postgres' });
    try {
      console.log('🔧 Connecting to rds:', host);
      await client.connect();
      console.log('🔧 Creating database:', database);
      await client.query(`CREATE DATABASE '${database}' IF NOT EXISTS '${database}'`);
    } catch (err) {
      console.error('❌ Failed to create database:', err.message);
      throw new DatabaseError(CODE_MESSAGES.FAILED_CREATE_DATABASE);
    } finally {
      await client.end();
    }
  }
}
