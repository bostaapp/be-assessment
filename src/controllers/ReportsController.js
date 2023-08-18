import { Create } from "../services/ReportServices.js";

export const createReports = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        if (!email) throw Error("email is required");
        else {
            await Create(email)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}