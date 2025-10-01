import mongoose from "mongoose";

const RedditPostsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imgUrl:{
        type:String
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
        ref:"RedditUser"
    },
    dislikes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"RedditUser",
        default:[]
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RedditUser",
        required:true
    },
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RedditCommunity",
        default:null
    }
},{
    timestamps:true
});

const RedditPosts = mongoose.model('RedditPosts', RedditPostsSchema);
export default RedditPosts;