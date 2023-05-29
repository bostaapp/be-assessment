export interface ICheck {
  userId: string;
  name: string;
  url: string;
  protocol: string;
  path?: string;
  port?: string;
  webhook?: string;
  timeout?: number;
  interval?: number;
  threshold?: number;
  authentication?: IAuth;
  httpHeaders: any;
  assert?: IAssert;
  tags?: string[];
  ignoreSSL?: boolean;
}

export interface ICheckUpdateInfo {
  name?: string;
  url?: string;
  protocol?: string;
  path?: string;
  port?: string;
  webhook?: string;
  timeout?: number;
  interval?: number;
  threshold?: number;
  authentication?: IAuth;
  httpHeaders: any;
  assert?: IAssert;
  tags?: string[];
  ignoreSSL?: boolean;
}

export interface IAuth {
  username: string;
  password: string;
}

export interface IAssert {
  statusCode: number;
}
