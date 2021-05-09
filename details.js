const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const logSchema = new Schema({
  name : {
      type:String,
      required:true
  } ,
  email: {
      type:String,
      required: true,
      unique:true
    },
  pass: {
      type:String,
      required:true
  },
  cpass: {
      type:String,
      required:true
  },
  mob: {
      type:String,
      required:true
  }
});

module.exports = mongoose.model('logdet', logSchema);          
