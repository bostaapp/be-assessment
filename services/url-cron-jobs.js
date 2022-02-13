import cron from 'node-cron';

import sendRequestToCheckUrl from './sendRequestToCheckUrl.js';

const urlChecks = new Map();

export function createUrlCheckerCronJob(url){
    const urlCheckCronJob = cron.schedule(`${parseInt(url.interval)} * * * *`, () => {
        const urlStatus = await sendRequestToCheckUrl(url);

        saveLogToDb(url, urlStatus);
    })

    urlChecks.set(url._id, urlCheckCronJob)
}

export function updateUrlCheckerCronJob(url){
    const urlCheckCronJob = urlChecks.get(url._id);

    urlCheckCronJob.destroy();

    urlChecks.delete(url._id);

    createUrlCheckerCronJob(url);
}

export function deleteUrlCheckerCronJob(url){
    const urlCheckCronJob = urlChecks.get(url._id);

    urlCheckCronJob.destroy();

    urlChecks.delete(url._id);
}
