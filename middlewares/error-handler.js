export default (error, req, res, next) => {
    console.log(error);

    return res
            .status(error.status || 500)
            .json({
                message: error.message || 'unknown error',
                code: error.code || 'unknwonCode',
            })
}