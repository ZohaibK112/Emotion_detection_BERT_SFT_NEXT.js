import mongoose, { Schema } from 'mongoose';

// Define the user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { 
  timestamps: true // This adds both createdAt and updatedAt fields automatically 
});

// Create and export the User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;