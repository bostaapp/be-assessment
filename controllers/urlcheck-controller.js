import { eventEmitter } from '../index.js';
import UrlCheck from '../models/UrlCheck.js';

export const createUrlCheck = async (req, res, next) => {
    try{
       const urlCheck = await UrlCheck.create({userId:req.decodedTokne._id, ...req.body});

       res.status(200).end();
       
       eventEmitter.emit('url-check-created', urlCheck);

       return;
    }
    catch(err){
        next(err);
    }
}

export const getUrlCheck = async (req, res, next) => {
    try{
        const urlChecks = await UrlCheck.find();
        
        return res.status(200).json(urlChecks);
    }
    catch(err){
        next(err);
    }
}

export const updateUrlCheck = async (req, res, next) => {
    try{
        const updatedUrlCheckawait = await UrlCheck.findOneAndUpdate({_id: req.params._id}, req.body, { new: true});

        res.status(200).end();
        
        eventEmitter.emit('updated-url-check-created', updatedUrlCheckawait);

        return
    }
    catch(err){
        next(err);
    }
}

export const deleteUrlCheck = async (req, res, next) => {
    try{
        const urlCheck = await UrlCheck.findById(req.params._id);

        await UrlCheck.findByIdAndDelete(req.params._id);
        
        res.status(200).end();
        
        eventEmitter.emit('deleted-url-check', urlCheck);

        return
    }
    catch(err){
        next(err);
    }
}