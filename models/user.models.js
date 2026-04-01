import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: '',
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  isblocked: {
    type: Boolean,
    default: false,
  },
  isbuyer: {
    type: String,
    default: '',
  },
  profilepicture: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: 'buyer',
  },
  otp: {},
  resetToken: {
    type: String,
  },
  // user details
  adress: {
    type: String,
    default: 'dummy.....',
  },
  city: {
    type: String,
    default: 'dummy....',
  },
  state: {
    type: String,
    default: 'dummy.....',
  },
  countrypostalcode: {
    type: String,
    default: 'dummy.....',
  },
  gender: {
    type: String,
    default: 'dummy.....',
  },
  dob: {
    type: String,
    default: 'dummy.....',
  },
  phonenumber: {
    type: Number,
    default: '',
  },
  adress: {
    type: String,
    default: 'dummy....',
  },
});

const user = model('users', userSchema);
export default user;
