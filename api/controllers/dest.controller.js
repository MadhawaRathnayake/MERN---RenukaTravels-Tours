import { errorHandler } from "../utils/error.js"

export const createDest = async (req, rest, next) => {
    if (!req.body.isAdmin){
        return next(errorHandler(403, 'You are not authenticate to make changes to the database'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please fill all the required areas'))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newDestination = new {
        ...req.body, slug, userId: req.user.id
    }
}