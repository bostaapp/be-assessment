interface IReport {
  id: string;
  status: string;
  outage: number;
  downtime: number;
  uptime: number;
  responseTime: number;
  history: { timestamp: Date; responseTime: number };
  urlCheck: IUrlCheck;
}

interface ICreateReportBody {
  status: string;
  outage: number;
  downtime: number;
  uptime: number;
  responseTime: number;
  history: { timestamp: Date; responseTime: number };
  urlCheck: IUrlCheck;
}

interface IListReportOptions {
  pageNumber: number;
  pageSize: number;
  urlCheckId: string;
}
