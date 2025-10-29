// Signup or login model
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, trim:true, unique: true }, 
  password: { type: String, required: true },
  role: { type: String, enum: ["farmer","agronomist"], required: true },
  createdAt: { type: Date, default: Date.now }
});

// hash password before save
userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword){
  return bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = User;