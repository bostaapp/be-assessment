import Joi from 'joi';

const ChecksValidation = {
    createCheck: {
        body: {
            name: Joi.string().required(),
            url: Joi.string().required(),
            protocol: Joi.string().valid('HTTP', 'HTTPS', 'TCP').required(),
            path: Joi.string(),
            port: Joi.number(),
            webhook: Joi.string(),
            timeout: Joi.number().default(5000),
            interval: Joi.number().default(600000),
            threshold: Joi.number().default(1),
            authentication: Joi.object({
                username: Joi.string(),
                password: Joi.string()
            }),
            httpHeaders: Joi.array().items(Joi.object({
                key: Joi.string(),
                value: Joi.string()
            })),
            assert: Joi.object({
                statusCode: Joi.number()
            }),
            tags: Joi.array().items(Joi.string()),
            ignoreSSL: Joi.boolean()
        }
    },

    getCheckById: {
        params: {
            id: Joi.string().hex().length(24).required()
        }
    },

    updateCheck: {
        params: {
            id: Joi.string().hex().length(24).required()
        }
    },

    deleteCheck: {
        params: {
            id: Joi.string().hex().length(24).required()
        }
    }
}

export default ChecksValidation;