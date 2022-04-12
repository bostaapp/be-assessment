const failedCase = (report, check, status) => {
    console.log("failed ")
    let info = {};
    const { outages, downtime, history } = report;
    const { interval } = check;
    let visits = history.length + 1
    info.status = status;
    info.outages = outages + 1;
    info.availability = ((visits - info.outages) / visits) * 100;
    info.downtime = downtime + interval
    
    info.history =
        [
            ...history,
            {
                status: status,
                timestamps: new Date().toISOString(),
            }
        ];

    return info;

}

module.exports = failedCase