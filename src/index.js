import UrlCheck from "./models/UrlCheck.js";
import pingUrl from "./helpers/pingUrl.js";
import app from "./app.js"
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port} `);
})

getAllChecks();
async function getAllChecks() {
    const checks = await UrlCheck.find();
    checks.forEach((check) => {
        pingUrl(check);
    })

}

export default app;

