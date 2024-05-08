export type RdsSecret = {
  username: string;

  password: string;
};

export type RdsParams = {
  host: string;

  protocol: string;

  options?: Record<string, string>;
};
