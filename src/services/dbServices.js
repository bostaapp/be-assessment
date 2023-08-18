import userSchema from '../models/verifieduser.js'
import urlCheckSchema from "../models/UrlCheck.js";
import reportSchema from "../models/report.js"

export const SaveUser = async (email) => {
    const newUser = new userSchema({
        email: email
    })
    newUser.save().then(savedUser => {
        console.log('User saved:', savedUser);
    })
        .catch(error => {
            console.error('Error saving user:', error);
        });
}
export const SaveCheck = async (
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
    ignoreSSL
) => {
    const newCheck = new urlCheckSchema({
        email: email,
        name: checkname,
        url: url,
        protocol: protocol,
        path: path,
        port: port,
        webhook: webhook,
        timeout: timeout,
        interval: interval,
        threshold: threshold,
        authentication: authentication,
        httpHeaders: httpHeaders,
        assert: assert,
        tags: tags,
        ignoreSSL: ignoreSSL
    })
    newCheck.save().then(savedCheck => {
        console.log('Check saved:', savedCheck);
    })
        .catch(error => {
            console.error('Error saving check:', error);
        });
}

export const GetAllChecks = async (email) => {
    try {
        const results = await urlCheckSchema.find({ email: email }).exec();
        return results;
    } catch (err) {
        console.error('Error:', err);
    }
}

export const GetAllChecksforscheduler = async () => {
    try {
        const results = await urlCheckSchema.find({}).exec();
        return results;
    } catch (err) {
        console.error('Error:', err);
    }
}

export const GetCheckName = async (email, checkname) => {
    try {
        const result = await urlCheckSchema.find({ email: email, name: checkname }).exec();
        console.log('Results:', result);
    } catch (error) {
        console.error('Error:', err);

    }
}

export const DeleteAllChecks = async (email) => {
    try {
        const deleteResult = await urlCheckSchema.deleteMany({ email: email });
        console.log('Deletion Result:', deleteResult);
    } catch (err) {
        console.error('Error:', err);
    }
}

export const updateCheckByEmailAndName = async (
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
    ignoreSSL) => {
    try {
        const updateFields = {
            url: url,
            interval: 1200,
            threshold: 2,
            protocol: protocol,
            path: path,
            port: port,
            webhook: webhook,
            timeout: timeout,
            interval: interval,
            threshold: threshold,
            authentication: authentication,
            httpHeaders: httpHeaders,
            assert: assert,
            tags: tags,
            ignoreSSL: ignoreSSL
        };
        const result = await URLCheck.findOneAndUpdate(
            { email, checkname },
            { $set: updateFields },
            { new: true } // This option returns the updated document
        );
        if (result) {
            return { success: true, message: "Update successful", updatedDocument: result };
        } else {
            return { success: false, message: "No matching document found" };
        }
    } catch (error) {
        return { success: false, message: "Update failed", error: error.message };
    }
}


export const CreateReport = async (
    name,
    url,
    status,
    availability,
    outages,
    downtime,
    uptime,
    responsetime,
    timestamp
) => {
    const newReport = new reportSchema({
        name: name,
        url: url,
        status: status,
        availability: availability,
        outages: outages,
        downtime: downtime,
        uptime: uptime,
        responseTime: responsetime,
        timestamp: timestamp,
    })
    newReport.save().then(savedReport => {
        console.log('Report saved:', savedReport);
    })
        .catch(error => {
            console.error('Error saving check:', error);
        });
}
