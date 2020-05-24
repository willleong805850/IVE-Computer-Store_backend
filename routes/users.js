const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Items = require('../model/Items');
const auth = require('../auth');
const config = require('../config');



module.exports = server => {

    //Get all user

    server.get('/user', async(req,res, next) => {
        try{
            const users = await User.find({});
            res.send(users);
            next();

        }catch(err){
            return next(new errors.InvalidContentError(err));
        }
        

    });

    //Get Single Users

    server.get('/user/:id', async(req, res, next) => {
        try{    
            const items = await User.findById(req.params.id);
            res.send(items);
            next();
        }catch(err){
         return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
        }
        });

     //Update Users
    
     server.put('/user/:id', async(req, res, next) => {
        //Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        
        try{
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, async (err, hash) => {
                   //Hash password
                   req.body.password = hash;
                   //Save User
                   try{
                    const item = await User.findOneAndUpdate({ _id: req.params.id }, req.body);
                    res.send(200);
                    next();
                   }catch(err){
                       return next(new errors.InternalError(err.message));
                   }
                });       
               });
            
        }catch{
            return next(new errors.ResourceNotFoundError(`There is no item with the id of ${req.params.id}`)); 
        }
    });

    //Register User
    server.post('/register', (req, res, next) => {
        const{email, password} = req.body;

        const user = new User({
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(user.password, salt, async (err, hash) => {
            //Hash password
            user.password = hash;
            //Save User
            try{
                const newUser = await user.save();
                res.send(201);
                next();
            }catch(err){
                return next(new errors.InternalError(err.message));
            }
         });       
        });
    });

    //Auth User
    server.post('/auth', async (req, res, next) => {
        const {email, password} = req.body;

        try{
            //Authenticate User
            const user = await auth.authenticate(email, password);
            
            //Create JWT
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '15m'
            });

            const {iat, exp} = jwt.decode(token);
            //Respond with token
            res.send({iat, exp, token});
            
        }catch(err){
            //User unauthorized
            return next(new errors.UnauthorizedError(err));
        }
    });

    //Delete User

    server.del('/user/:id', async(req, res, next) =>{
        try{
            const items = await User.findOneAndRemove({_id: req.params.id});
            res.send(204);
            next();
        }catch{
            return next(new errors.ResourceNotFoundError(`There is no item with the id of ${req.params.id}`)); 
        }
    });
};
