exports.isAuthorized = (userID, ownerID) => {
    let authorized = (userID.equals(ownerID)) ? true : false;
    return authorized;
}

