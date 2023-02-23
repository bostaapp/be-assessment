const mongoose = require("mongoose");

const Verfication = require("../../models/verification");
const User = require("../../models/user");

exports.getVerfication = async (req, res) => {
    const verificationId = req.params.verificationId;

    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const verification = await Verfication.findOne(
            { _id: verificationId },
            null,
            { session }
        );
        console.log("BEARER: " + verification);

        if (!verification) throw "verification is timed up";

        const updatedUser = await User.updateOne(
            { _id: verification.user },
            { $set: { verficationState: true } },
            { session }
        );
        console.log("updatedUser: " + updatedUser);

        const deletedVerication = await Verfication.deleteOne(
            { _id: verificationId },
            { session }
        );
        console.log("deletedVerication: " + deletedVerication);

        await session.commitTransaction();
        console.log("commitTransaction");
        await session.endSession();
        console.log("endSession");

        res.status(200).json({ message: "user has been verified" });
    } catch (err) {
        console.log("error from verification: " + err);

        await session.abortTransaction();
        await session.endSession();
        console.log("aborted");
        
        res.status(400).json({ message: err });
    }
};
