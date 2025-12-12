const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken}=require('../jwt')
const Candidate = require('../models/candidates');


const checkAdminRole = async (userId) =>{
  try{
    const user = await User.findById(userId);
    if (user.role === 'admin'){
        return true;
    }
    return false;
  }catch(err){
    return false;
  }
}


// post method to get candidate
router.post('/',jwtAuthMiddleware, async(req, res) =>{
  console.log(req.user);
  console.log(req.body)
  try {
    console.log(req.user);
      if(!(await checkAdminRole(req.user.userData.id)))
        return res.status(403).json({message: 'user does not have admin role'});

    const data = req.body; // Assuming the request body contains the candidate data.

    // Create a new User detail document using the mongoose model
    const newcandidate = new Candidate(data);

    // Save the User to the database
    const response = await newcandidate.save();
    console.log('data saved');

    res.status(200).json({response: response });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


// update methode using put.
router.put('/:candidateID',jwtAuthMiddleware,async(req, res) =>{
  try{
       if(!(await checkAdminRole(req.user.userData.id)))
        return res.status(403).json({message: 'user does not have admin role'});

      const candidateID = req.params.candidateID; // Extract the id from the URL parameter.
      const updatedcandidateData = req.body; // Update data for the person.

      const response = await Candidate.findByIdAndUpdate(candidateID, updatedcandidateData,{
        new: true, // Return the update document
        runValidators: true // Run Mongoose validation
      })

      // if response send null then 404 show on display.
      if(!response){
        return res.status(404).json({error: "Candidate not found"});
      }

      console.log('Candidate data updated');
      res.status(200).json(response);
  }catch(err){
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.delete('/:candidateID',jwtAuthMiddleware,async(req, res) =>{
  try{
       if(!(await checkAdminRole(req.user.userData.id)))
        return res.status(403).json({message: 'user does not have admin role'});

      const candidateID = req.params.candidateID; // Extract thr id from the URL parameter.
     

      const response = await Candidate.findByIdAndDelete(candidateID);

      // if response send null then 404 show on display.
      if(!response){
        return res.status(404).json({error: "Candidate not found"});
      }

      console.log('Candidate DELETED');
      res.status(200).json(response);
  }catch(err){
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

// let's start voting
router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
  // no admin can vote
  // user can only vote once

  candidateID = req.params.candidateID;
  userId = req.user.userData.id;

  try{

    // find the candidate document with the specified candidateID
    const candidate = await Candidate.findById(candidateID);
    if(!candidate){
      return res.status(404).json({ message: 'Candidate not found'});
    }

    const user = await User.findById(userId);
     if(!user){
      return res.status(404).json({ message: 'user not found'});
    }
    if(user.isVoted){
      return res.status(400).json({ message: 'you have alrdy voted'});
    }
    if(user.role == 'admin'){
      return res.status(403).json({ message: 'admin is not allowed'});
    }

    // update the candidate document to record the vote
    candidate.Votes.push({user: userId});
    candidate.voteCount++;
    await candidate.save();

    // update the user document 
    user.isVoted = true;
    await user.save();

      res.status(200).json({ message: 'vote recorded succesfully' });
  }catch(err){
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// vote count
router.get('/vote/count', async(req,res)=>{
  try{
    // find all candiddate and sort them by votecount in descending order
    const candidate = await Candidate.find().sort({voteCount: 'desc'});

    // Map the candidates to only their name and votecount
    const VoteRecord = candidate.map((data)=>{
      return{
        party: data.party,
        count: data.voteCount
      }
    });
    return res.status(200).json(VoteRecord);

  }catch(err){
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// list of candidates
router.get('/candidates', async(req,res)=>{
  try{
   // List of candidates
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  }catch(err){
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
module.exports = router;