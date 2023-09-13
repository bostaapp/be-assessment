import { $Enums, UrlCheck, UrlLog } from "@prisma/client";

export interface UrlCheckOptions extends Omit<UrlCheck, "userId"> {
  authentication: { username: string; password: string };
  httpHeaders: Record<string, any>;
  assert: Record<string, any>;
}

export interface Report {
  status: $Enums.UrlStatus; // The current status of the URL.
  availability: string; // A percentage of the URL availability.
  outages: number; // The total number of URL downtimes.
  downtime: number; // The total time, in seconds, of the URL downtime.
  uptime: number; // The total time, in seconds, of the URL uptime.
  responseTime: number; // The average response time for the URL.
  history: UrlLog[]; // Timestamped logs of the polling requests.
}
