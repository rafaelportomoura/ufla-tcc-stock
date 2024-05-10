export type RdsSecret = {
  username: string;

  password: string;
};

export type RdsParams = {
  host: string;
  port: number;
  protocol: string;

  options?: Record<string, string>;
};
