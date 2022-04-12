const pagination = (page, size) => {

    try {
        let skip = (page - 1) * size
        return { skip, limit: size }
        
    } catch (error) {
        return error
    }


}


module.exports = { pagination };