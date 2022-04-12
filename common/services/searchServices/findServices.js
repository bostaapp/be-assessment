const findService = async (model, search, fields, userID, owner) => {
    let data;
    if (search) {
        const columns = [
            ...fields.map((field) => {
                return {
                    [field]: { $regex: search, $options: 'i' }
                }
            })
        ]
        data = await model.find({ $and: [{ [owner]: userID }, { $or: columns }] }).limit(limit).skip(skip)
    } else {
 
        data = await model.find({ [owner]: userID}).limit(limit).skip(skip)
        console.log(data)

    }
    return data
}




module.exports = {
    findService
}