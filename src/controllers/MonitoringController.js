import { CreateCheck, GetChecks, GetByCheckName, DeleteAllChecksByEmail, UpdateCheck } from "../services/MonitoringServices.js";
export const CreateUrlCheck = async (req, res) => {
    try {
        const {
            email,
            checkname,
            url,
            protocol,
            path,
            port,
            webhook,
            timeout,
            interval,
            threshold,
            authentication,
            httpHeaders,
            assert,
            tags,
            ignoreSSL,
        } = req.body;
        if (!email) throw Error("email is required");
        if (!checkname) throw Error("check name is required");
        if (!url) throw Error("url is required");
        if (!protocol) throw Error("protocol is required");
        else {
            await CreateCheck(email, checkname, url, protocol, path, port, webhook, timeout, interval, threshold, authentication, httpHeaders, assert, tags, ignoreSSL)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const GetAllUrlChecks = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        if (!email) throw Error("email is required");
        else {
            console.log(email)
            GetChecks(email)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const GetCheckByName = async (req, res) => {
    try {
        const {
            email,
            checkname
        } = req.body
        if (!email) throw Error("email is required");
        if (!checkname) throw Error("email is required");
        else {
            GetByCheckName(email, checkname);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

export const DeleteChecks = async (req, res) => {
    try {
        const {
            email,
        } = req.body
        if (!email) throw Error("email is required");
        else {
            DeleteAllChecksByEmail(email);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

export const UpdateUrlCheck = async (req, res) => {
    try {
        const {
            email,
            checkname,
            url,
            protocol,
            path,
            port,
            webhook,
            timeout,
            interval,
            threshold,
            authentication,
            httpHeaders,
            assert,
            tags,
            ignoreSSL,
        } = req.body;
        if (!email) throw Error("email is required");
        if (!checkname) throw Error("check name is required");
        if (!url) throw Error("url is required");
        if (!protocol) throw Error("protocol is required");
        else {
            await UpdateCheck(
                email,
                checkname,
                url,
                protocol,
                path,
                port,
                webhook,
                timeout,
                interval,
                threshold,
                authentication,
                httpHeaders,
                assert,
                tags,
                ignoreSSL,)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
