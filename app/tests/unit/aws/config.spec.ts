/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { aws_config, aws_params } from '../../../src/aws/config';
import { CONFIGURATION } from '../../../src/constants/configuration';

describe('AWS -> Config', () => {
  it('Should get default config', () => {
    const params = aws_params();
    const config = aws_config(params);
    expect(config).deep.eq({ region: 'us-east-2', credentials: params.credentials });
  });
  it('Should get prod config', () => {
    (CONFIGURATION as Record<string, unknown>).STAGE = 'prod';
    const params = aws_params();
    const config = aws_config(params);
    expect(config).deep.eq({
      region: CONFIGURATION.REGION,
      credentials: config.credentials
    });
    (CONFIGURATION as Record<string, unknown>).STAGE = 'development';
  });
});
