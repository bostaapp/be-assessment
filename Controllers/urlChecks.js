const { apiError } = require("../Utils/apiError");
const { Check, validateCheck } = require("../Models/urlCheck");
const reportController = require("../Controllers/reports");
const { userExists } = require("../Controllers/users");
const eventEmitter = require("./events");


const isValidUrl = (urlString) => {
    const urlPattern = new RegExp("^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$", "i"); // validate fragment locator
    return !!urlPattern.test(urlString);
};

function validCheckParameters(check, update = false) {
    const isNotValid = validateCheck(check, update);
    if (isNotValid) throw new apiError(400, isNotValid.details[0].message);
}

async function getCheckByID(checkID) {
    return Check.findById(checkID).exec();
}

const createCheck = async (check, userID) => {
    if (!userID) throw new apiError(400, "User Missing");

    //Check user Existence
    if (!await userExists(userID))
        throw new apiError(400, "User Does Not Exist");

    validCheckParameters(check);
    const urlObj = new URL(check.url);
    const newCheck = {
        ...check,
        url: urlObj.hostname,
        path: urlObj.pathname ? urlObj.pathname : null,
        userID,
        protocol: urlObj.protocol,
        port: urlObj.port
    };
    if (newCheck.webhook && !isValidUrl(newCheck.webhook))
        throw new apiError(400, "Not a Valid URL");

    // Check Duplicate URL
    const foundCheckDuplicate = await Check.findOne({ name: newCheck.name, url: newCheck.url, userID });
    if (foundCheckDuplicate) throw new apiError(400, "Duplicate Check");

    const checkCreated = await new Check(newCheck).save();

    // Create Accompanied Report
    await reportController.createReport({}, checkCreated._id, userID);

    eventEmitter.emit("Check Created", checkCreated);
    return { message: "Check Created", checkID: checkCreated._id };
};

const getChecks = async (userID) => {
    if (!userID) throw new apiError(400, "User Missing");

    //Check user Existence
    if (!await userExists(userID))
        throw new apiError(400, "User Does Not Exist");

    const userChecks = await Check.find({ userID });

    return { message: "Checks Found", userChecks };
};

const getAllChecks = async () => {
    return Check.find({});
};

const getCheckByName = async (userID, checkName) => {
    if (!userID) throw new apiError(400, "User Missing");
    if (!checkName) throw new apiError(400, "Check Name Missing");
    //Check user Existence
    if (!await userExists(userID))
        throw new apiError(400, "User Does Not Exist");

    const exists = await Check.exists({ name: checkName, userID });
    if (!exists)
        throw new apiError(400, "Check Not Found");
    const check = await Check.findById(exists);
    return { message: "Found Check", check };
};


const getCheckByTag = async (userID, tags) => {
    if (!userID) throw new apiError(400, "User Missing");
    if (!tags) throw new apiError(400, "Missing Tag");
    //Check user Existence
    if (!await userExists(userID))
        throw new apiError(400, "User Does Not Exist");

    const checksGroupedByTag = await Check.find({ userID, tags });
    if (!checksGroupedByTag)
        throw new apiError(400, "No Checks found with given tag");
    return { message: "Check Found with Tag", checksGroupedByTag };
};

const updateCheck = async (userID, checkID, newCheck) => {
    if (!newCheck || Object.keys(newCheck).length === 0)
        throw new apiError(400, "Empty Update Check");
    if (!checkID)
        throw new apiError(400, "Missing Check ID");
    if (!userID)
        throw new apiError(400, "Missing User ID");
    //Check user Existence
    if (!await userExists(userID))
        throw new apiError(400, "User Does Not Exist");
    validCheckParameters(newCheck, true);
    let newCheckUpdated = {
        ...newCheck
    };
    if (newCheck.url) {

        const urlObj = new URL(newCheck.url);
        newCheckUpdated = {
            url: urlObj.hostname,
            path: urlObj.pathname ? urlObj.pathname : null,
            protocol: urlObj.protocol,
            port: urlObj.port
        };
    }

    const exists = await Check.exists({ _id: checkID, userID });

    if (!exists)
        throw new apiError(400, "Check Not Found");

    // Clear History
    await reportController.updateReport({ history: [] }, checkID, userID);

    Check.findByIdAndUpdate(exists, newCheckUpdated).then((newCheck) => {
        eventEmitter.emit("Check Update", newCheck);
    });
    return { message: "Check Updated" };
};


const deleteCheck = async (userID, checkID) => {
    if (!checkID)
        throw new apiError(400, "Missing Check ID");
    if (!userID)
        throw new apiError(400, "Missing User ID");
    //Check user Existence
    if (!await userExists(userID))
        throw new apiError(400, "User Does Not Exist");

    const exists = await Check.exists({ _id: checkID, userID });
    if (!exists)
        throw new apiError(400, "Check Not Found");

    // Delete Accompanied Report
    await reportController.deleteReport(checkID, userID);

    await Check.findByIdAndDelete(exists);
    return { message: "Check Deleted" };
};


module.exports = {
    getAllChecks,
    getCheckByID,
    createCheck,
    getChecks,
    getCheckByName,
    getCheckByTag,
    updateCheck,
    deleteCheck
};
