const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Define the person schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,  // define type of data
        required: true // mendatry to enter data
    },
    age:{
        type: Number,
        require: true
    },
    email:{
        type: String,
    },
    mobile:{
        type: String,
    },
    address:{
        type: String,
        require: true
    },
    aadharCardNumber:{
        type: Number,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require:true
    },
    role:{
        type: String,
        enum: ['voter','admin'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next){
    const user = this;
    
    // Hash the password only if it has been modified (or is new)
    if(!user.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password 
        const hashedPassword = await bcrypt.hash(user.password,salt);
        
        // Override the plain password with the hashed one
        user.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    try{
        // Use bcrypt to compare th provided password with the hashed password.
        const isMatch = await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

// create user data
const User = mongoose.model('users', userSchema);
module.exports = User;