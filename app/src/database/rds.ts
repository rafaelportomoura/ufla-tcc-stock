import { isEmpty } from 'lodash';
import qs from 'qs';
import { SecretsManager } from '../aws/secretsManager';
import { SSM } from '../aws/ssm';
import { CONFIGURATION } from '../constants/configuration';
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
    const { protocol, host, options } = params;

    const query = !isEmpty(options) ? `?${qs.stringify(options)}` : '';

    return `${protocol}://${username}:${encodeURIComponent(password)}@${host}/${CONFIGURATION.MICROSERVICE}${query}`;
  }
}
