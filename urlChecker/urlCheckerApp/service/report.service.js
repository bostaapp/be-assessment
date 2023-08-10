const stream = require("stream");
const fillBody = (body) => {
    const htmlString = `
    <!DOCTYPE html>
    <html lang="en">
       <head>
          <title>My Title</title>
       </head>
       <body>${body}</body>
    </html>`;
    return htmlString;
}

const generateReportHeaders = (user) => {
    const htmlString = `
    <h1>URL Checker Report</h1>
    <h2>Report generated at: ${new Date().toLocaleString("en-GB")}</h2>
    <h2>User: ${user.email}</h2>
    <hr>

    `
    return htmlString;
}
const generateTable = (history) => {
    const tableHtmls = history.map((history) => {
        return `
        <tr>
            <td>${history.status}</td>
            <td>${history.responseTimeInMS} ms</td>
            <td>${history.timestamp}</td>
        </tr>
        `
    })
    const htmlString = `
    <tr>
        <th>Status</th>
        <th>Response Time </th>
        <th>Timestamp</th>
    </tr>
    ${tableHtmls.join("")}
    `
    return htmlString;

}
const generateURLHtml = (data) => {
    const urlHtmls = data.map((url) => {
        return ` 
        <li>
            <h3>${url.name} - ${url.url} - Status: ${url.status} - Average Response Time : ${url.averageResponseTime} ms </h3>
            <h3>Availability Percentage : ${url.availability} % - total # of outages : ${url.outages} </h3>
            <h3>Uptime : ${url.uptime} seconds - Downtime : ${url.downtime} seconds </h3>
            <h3>History : </h3>
            <td>
            <table border="1">
                ${generateTable(url.history)}
            </table>

        </li>
         `
    })

    const htmlString = `
    <ul>
        ${urlHtmls.join("")}
     </ul>
    `
    return htmlString;
}




exports.generateReport = async (data, user) => {
    const html = fillBody(generateReportHeaders(user) + generateURLHtml(data))
    // const html = fillBody("<h1>Report</h1>")
    const readStream = new stream.PassThrough();
    readStream.end(html);
    return {
        fileName: `report_${new Date().toISOString()}.html`,
        readStream: readStream
    }
}