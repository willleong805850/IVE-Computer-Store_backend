const errors = require('restify-errors');
const Items = require('../model/Items');

module.exports = server => {
    //Get Items

    server.get('/items', async(req, res, next) => {
    try{
    	var mysort = {category: 1}  
        const items = await Items.find({}).sort(mysort);
        res.send(items);
        next();
    }catch(err){
     return next(new errors.InvalidContentError(err));
    }
    });

    //Get Single Items

    server.get('/items/:id', async(req, res, next) => {
        try{    
            const items = await Items.findById(req.params.id);
            res.send(items);
            next();
        }catch(err){
         return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
        }
        });

    //Add Item

    server.post('/items', async(req, res, next) => {
        //Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const {name, specs, price, category} = req.body;

        const items = new Items({
            name,
            specs,
            price,
            category
        });

        try{
            const newItem = await items.save();
            res.send(201);
            next();
        }catch{
            return next(new errors.InternalError(err.message));
        }
    });

    //Update Item
    
    server.put('/items/:id', async(req, res, next) => {
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

    //Delete Item

    server.del('/items/:id', async(req, res, next) =>{
        try{
            const items = await Items.findOneAndRemove({_id: req.params.id});
            res.send(204);
            next();
        }catch{
            return next(new errors.ResourceNotFoundError(`There is no item with the id of ${req.params.id}`)); 
        }
    });

}
