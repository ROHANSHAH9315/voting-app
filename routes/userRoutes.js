const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken}=require('./../jwt')

// post method to get User
router.post('/signup', async(req, res) =>{
  try {
    const data = req.body; // Assuming the request body contains the User data.

    // Check if there is already an admin user
    // const adminUser = await user.findOne({ role: 'admin'});
    // if(data.role === 'admin' && adminUser){
    //   return res.status(400).json({ error: 'admin is alrdy exists'});
    // }


    // Create a new User detail document using the mongoose model
    const newUser = new User(data);

    // Save the User to the database
    const response = await newUser.save();
    console.log('data saved');

    // payload 
    const payload = {
      id: response.id,
    }
    console.log(JSON.stringify(payload));
    
    // generate token's
    const token = generateToken(payload);
    console.log("Token is : ", token);

    res.status(200).json({response: response, token: token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Login Route
router.post('/login', async(req, res)=>{
  try{
      // Extract username and password from request body
      const {aadharCardNumber, password} = req.body;

      // find the user by username
      const user = await user.findOne({aadharCardNumber: aadharCardNumber});

      // if user does not exist or password does not match, return error
      if( !user || !(await user.comparePassword(password))){
        return res.status(401).json({erro: 'Invaid username or password'});
      }

      //generate Token
      const payload = {
        id: user.id,
      }
      const Token= generateToken(payload);

      // resturn token as reponse
      res.json({Token})
  }catch(err){
    console.log(err);
    res.status(500).json({ error: 'Token Server Error' });
  }
})

// Profile route
router.get('/profile',jwtAuthMiddleware, async(req, res) =>{
  try{
      const userData = req.user;

      const userId = userData.id;
      const user = await Person.findById(userId);

      res.status(200).json({user});
  }catch(err){
      console.log(err);
      res.status(500).json({ error: 'Token Server Error' });
  }
})

// update methode using put.
router.put('/profile/password',jwtAuthMiddleware ,async(req, res) =>{
  try{
      const userId =req.user; // Extract thr id from the token
      const { currenPassword, newPassword} = req.body // Extract current and new password from req.body.

      // find the user by userId.
      const user = await user.findById(userId);

       // if password does not match, return error
      if(!(await user.comparePassword(currenPassword))){
        return res.status(401).json({erro: 'Invaid username or password'});
      }

      //update the user's password
      user.password = newPassword;
      await user.save();
      
      console.log('password updated');
      res.status(200).json({message: "Password updated"});
  }catch(err){
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})


module.exports = router;