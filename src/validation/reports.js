import Joi from 'joi';

const ReportsValidation = {
    getReportByCheckId: {
        params: {
            checkId: Joi.string().hex().length(24).required()
        }
    },

    getReportsByTags: {
        query: {
            tags: Joi.array().items(Joi.string()).min(1).required()
        }
    }
}

export default ReportsValidation;