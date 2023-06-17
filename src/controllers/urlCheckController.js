import pingUrl from "../helpers/pingUrl.js";
import UrlCheck from "../models/UrlCheck.js";
import Report from "../models/Report.js";

export const addUrlCheck = async (req, res) => {
    const urlCheckData = req.body;
    try {
        if (!urlCheckData.name) throw Error("name is required");
        if (!urlCheckData.url) throw Error("url is required");
        if (!urlCheckData.protocol) throw Error("protocol is required");
        const isUrlExist = await UrlCheck.findOne({ url: urlCheckData.url }).where({ userId: req.user._id });
        if (isUrlExist) throw Error("this url already exists");
        const urlData = {
            userId: req.user._id,
            name: urlCheckData.name,
            url: urlCheckData.url,
            protocol: urlCheckData.protocol,
            path: urlCheckData.path,
            port: urlCheckData.port,
            webhook: urlCheckData.webhook,
            threshold: urlCheckData.threshold,
            authentication: urlCheckData.authentication,
            httpHeaders: urlCheckData.httpHeaders,
            assert: urlCheckData.assert,
            tag: urlCheckData.tag,
            ignoreSSL: urlCheckData.ignoreSSL
        }
        if (urlCheckData.interval) {
            urlData.interval = urlCheckData.interval * 60000;
        }
        if (urlCheckData.timeout) {
            urlData.timeout = urlCheckData.timeout * 1000;
        }
        const newUrlCheck = await new UrlCheck(urlData).save();
        new Report({ urlCheckId: newUrlCheck._id, userId: req.user._id }).save();
        pingUrl(newUrlCheck);
        return res.status(201).json({ message: "url check created", urlCheck: newUrlCheck });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

}
export const getAllUrlChecks = async (req, res) => {
    const { tags } = req.query;
    try {
        const urlChecks = tags ?
            await UrlCheck.find({ userId: req.user._id, tag: { $in: tags } })
            :
            await UrlCheck.find({ userId: req.user._id })

        if (urlChecks.length === 0) throw Error("no url checks found");
        return res.status(200).json(urlChecks);

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
export const getUrlCheckById = async (req, res) => {
    try {
        const id = req.params.id;
        const urlCheck = await UrlCheck.findById(id).where({ userId: req.user._id });
        if (urlCheck.length === 0) throw Error("no urls found ");
        return res.status(200).json(urlCheck);

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
export const deleteUrlCheck = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const urlCheck = await UrlCheck.findByIdAndDelete(id);
        const report = await Report.findOneAndDelete({ urlCheckId: id }).where({ userId: req.user._id })
        console.log(urlCheck);
        if (!urlCheck) throw Error("no url check found to delete");
        return res.status(200).json({ message: `url check ${id} deleted` });
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }

}
export const updateUrlCheck = async (req, res) => {
    const urlCheckData = req.body;
    const id = req.params.id;
    try {
        const urlData = {
            userId: req.user._id,
            name: urlCheckData.name,
            url: urlCheckData.url,
            protocol: urlCheckData.protocol,
            path: urlCheckData.path,
            port: urlCheckData.port,
            webhook: urlCheckData.webhook,
            timeout: urlCheckData.timeout,
            interval: urlCheckData.interval,
            threshold: urlCheckData.threshold,
            authentication: urlCheckData.authentication,
            httpHeaders: urlCheckData.httpHeaders,
            assert: urlCheckData.assert,
            tag: urlCheckData.tag,
            ignoreSSL: urlCheckData.ignoreSSL
        }
        const updateCheck = await UrlCheck.findByIdAndUpdate(id, urlData).where({ userId: req.user._id });
        if (!updateCheck) throw Error("couldnt update the url check");
        return res.status(200).json({
            message: "url check updated",
            updatedCheck: urlData
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}