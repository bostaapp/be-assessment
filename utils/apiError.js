export default class ApiError extends Error{ 
    constructor({message, status, code}){
        super(message),
        this.status = status,
        this.code = code
    }
}