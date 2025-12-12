const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res,next) =>{

    // first check request header has autherization or not.
    const authorization=req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'Tokens Not Found'});


    // Extract the jwt tokken from the request headers.
    const token = authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized' });

    try{
        // Verify the JWT TOken
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object.
        req.user = decoded
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({error: 'Invalid token'});
    }
}


// Funtion to generate JwT token
const generateToken = (userData) =>{
    // generate a new Jwt token using user data
    return jwt.sign({userData}, process.env.JWT_SECRET, {expiresIn: 30000});

}

module.exports = {jwtAuthMiddleware, generateToken};