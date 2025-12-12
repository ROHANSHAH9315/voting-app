const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

//Define the person schema
const candidateSchema = new mongoose.Schema({
    name:{
        type: String,  // define type of data
        required: true // mendatry to enter data
    },
    party:{
        type: String,
        required: true
    },
    age:{
        type: String,
        required: true
    },
    Votes: [
        {
            user: {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }      
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }

});


// create user data
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;