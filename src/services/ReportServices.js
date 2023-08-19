import { GetAllChecks, CreateReport } from './dbServices.js'
import { monitorUrl } from './Checker.js';
export const Create = async (email) => {
    const checks = await GetAllChecks(email);
    checks.forEach(async check => {
        const results = await monitorUrl(check.url)
        console.log(check.name)
        console.log(check.url)
        console.log(results.status)
        console.log( results.responseTime)
        console.log(new Date())

        await CreateReport(
            check.name,
            check.url,
            results.status,
            100,
            0,
            0,
            0,
            results.responseTime,
            new Date(),
        )
    })
    // console.log(checks);
}
