const errors = require('restify-errors');
const Comments = require('../model/Comments');
const Items = mongoose.model("Item");

module.exports = server => {
    //Get Comments

    server.get('/comments', async(req, res, next) => {
    try{    
        const comments = await Comments.find({});
        res.send(comments);
        next();
    }catch(err){
     return next(new errors.InvalidContentError(err));
    }
    });

    //Get Single Comments

    server.get('/comments/:id', async(req, res, next) => {
        try{    
            const comments = await Comments.findById(req.params.id);
            res.send(comments);
            next();
        }catch(err){
         return next(new errors.ResourceNotFoundError(`There is no comments with the id of ${req.params.id}`));
        }
        });

    //Add Item

    server.post('/comments', async(req, res, next) => {
        //Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const {text, items, author} = req.body;

        const comments = new Comments({
            text,
            items,
            author
        });

        try{
            const newItem = await comments.save();
            res.send(201);
            next();
        }catch{
            return next(new errors.InternalError(err.message));
        }
    });

    //Update Comments
    
    server.put('/comments/:id', async(req, res, next) => {
        //Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try{
            const item = await Items.findOneAndUpdate({ _id: req.params.id }, req.body);
            res.send(200);
            next();
        }catch{
            return next(new errors.ResourceNotFoundError(`There is no item with the id of ${req.params.id}`)); 
        }
    });

    //Delete Comments

    server.del('/comments/:id', async(req, res, next) =>{
        try{
            const items = await Items.findOneAndRemove({_id: req.params.id});
            res.send(204);
            next();
        }catch{
            return next(new errors.ResourceNotFoundError(`There is no item with the id of ${req.params.id}`)); 
        }
    });

}
