const sucessCase = (report, check, response) => {
    console.log("success")
    let info = {};
    const { status, headers } = response;
    const { outages, uptime, responseTime, history } = report;
    const { interval } = check;
    let visits = history.length + 1
    info.status = status;
    info.availability = ((visits - outages) / visits) * 100;
    info.uptime = uptime + interval;
    info.responseTime = (responseTime + headers["duration"]) / 2;
    info.history =
        [
            ...history,
            {
                status: status,
                responseTime: headers["duration"],
                timestamps: new Date().toISOString(),
            }
        ];
    console.log(info)
    return info;

}
module.exports = sucessCase