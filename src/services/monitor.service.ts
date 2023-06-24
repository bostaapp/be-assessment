import https from 'https';

import axios from 'axios';

import * as reportService from './report.service';
import Logger from '../utils/logger.util';

const activeMonitors: { [urlCheckId: string]: NodeJS.Timer } = {};

export const createMonitoring = async (urlCheckId: string, updatedUrlCheck: IUrlCheck): Promise<void> => {
  const newMonitorInterval = await monitor(updatedUrlCheck);
  activeMonitors[urlCheckId] = newMonitorInterval;
  Logger.info('CREATE MONITOR', { activeMonitors: Object.keys(activeMonitors) });
};

export const updateMonitoring = async (urlCheckId: string, updatedUrlCheck: IUrlCheck): Promise<void> => {
  const monitorInterval = activeMonitors[urlCheckId];
  if (monitorInterval) {
    clearInterval(monitorInterval);
    delete activeMonitors[urlCheckId];
  }
  const newMonitorInterval = await monitor(updatedUrlCheck);
  activeMonitors[urlCheckId] = newMonitorInterval;
  Logger.info('UPDATE MONITOR', { activeMonitors: Object.keys(activeMonitors) });
};

export const deleteMonitoring = async (urlCheckId: string): Promise<void> => {
  const monitorInterval = activeMonitors[urlCheckId];
  if (monitorInterval) {
    clearInterval(monitorInterval);
    delete activeMonitors[urlCheckId];
  }
  Logger.info('UPDATE MONITOR', { activeMonitors: Object.keys(activeMonitors) });
};

// Should be cron job instead of setInterval
export const monitor = async (urlCheck: IUrlCheck): Promise<NodeJS.Timer> => {
  const {
    authentication,
    ignoreSsl,
    path,
    port,
    protocol,
    // threshold, // to create an alert
    timeout,
    url,
    // webhook, // to recieve notifications
    assert: { statusCode },
    interval,
    httpHeaders,
  } = urlCheck;

  const requestOptions = {
    url: `${protocol.toLowerCase()}://${url}${path ? path : ''}${port ? `:${port}` : ''}`,
    method: 'GET',
    timeout: timeout,
    httpsAgent: ignoreSsl ? new https.Agent({ rejectUnauthorized: false }) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (authentication?.username && authentication?.password) {
    const authHeader =
      'Basic ' + Buffer.from(`${authentication.username}:${authentication.password}`).toString('base64');
    requestOptions.headers['Authorization'] = authHeader;
  }

  if (httpHeaders && Array.isArray(httpHeaders)) {
    httpHeaders.forEach((header) => {
      requestOptions.headers[header.key] = header.value;
    });
  }
  Logger.info({ requestOptions });

  const report: ICreateReportBody = {
    status: 'unknown',
    outage: 0,
    downtime: 0,
    uptime: 0,
    responseTime: 0,
    history: { timestamp: new Date(), responseTime: 0 },
    urlCheck,
  };

  const monitorInterval = setInterval(async () => {
    const startTime = Date.now();
    try {
      const response = await axios(requestOptions);
      if (response.status === statusCode) {
        report.status = 'up';
        report.uptime = (report.uptime + (Date.now() - startTime)) / 1000;
        report.responseTime = Date.now() - startTime;
        await reportService.create(report, urlCheck);
        Logger.info('URL is up');
      } else {
        report.status = 'up';
        report.uptime = (report.uptime + (Date.now() - startTime)) / 1000;
        report.responseTime = Date.now() - startTime;
        await reportService.create(report, urlCheck);
        Logger.warn('URL is up, but the response status does not match the expected status code');
      }
    } catch (error) {
      report.status = 'down';
      report.outage++;
      report.downtime = (report.downtime + (Date.now() - startTime)) / 1000;
      report.responseTime = Date.now() - startTime;
      await reportService.create(report, urlCheck);
      Logger.error('URL is down', { error });
    }
  }, interval);

  return monitorInterval;
};
