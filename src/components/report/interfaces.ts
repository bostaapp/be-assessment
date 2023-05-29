export interface IReport {
  status?: number;
  availability?: number;
  outages?: number;
  downtime?: number;
  uptime?: number;
  responseTime?: number;
  history?: IHistory[];
}

export interface ICreateReport extends IReport {
  userId: string;
  checkId: string;
}

export interface IHistory {
  status: number;
  timestamp: Date;
}
