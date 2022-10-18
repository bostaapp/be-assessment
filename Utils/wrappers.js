// Async Function Wrapper
const tryCatchWrapExpress = (callback) => {
    return async (req, res, next) => {
        try {
            // Execute the Passed Callback
            await callback(req, res, next);
        } catch (error) {
            //Catch errors if any
            next(error);
        }
    };
};

module.exports = {
    tryCatchWrapExpress
};
