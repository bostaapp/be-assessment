const mongoose = require("mongoose");

const Verfication = require("../../models/verification");
const User = require("../../models/user");

exports.getVerfication = (req, res) => {
    const verificationId = req.params.verificationId;
    console.log(req.params);

    let session;
    let user;

    mongoose
        .startSession()
        .then((sess) => {
            sess.startTransaction();
            session = sess;
            return;
        })
        .then(() => {
            return Verfication.findOne({ _id: verificationId }, null, { session });
        })
        .then((verification) => {
            console.log("BERER: " + verification);
            if (verification)
                return User.updateOne(
                    { _id: verification.user },
                    { $set: { verficationState: true } },
                    { session }
                );
            else throw new Error("verification is timed up");
        })
        .then((updatedUser) => {
            return Verfication.deleteOne({ _id: verificationId }, { session });
        })
        .then((deletedVerication) => {
            console.log("deletedVerication: " + deletedVerication);

            return session.commitTransaction();
        })
        .then(() => {
            console.log("commitTransaction");
            return session.endSession();
        })
        .then(() => {
            console.log("endSession");

            res.sendStatus(200).json({ message: "user has been verified" });
        })
        .catch((err) => {
            console.log("error from verification: " + err);
            session
                .abortTransaction()
                .then(() => session.endSession())
                .then(() => {
                    console.log("aborted");
                    res.status(400).json({ message: err });
                });
        });
};
