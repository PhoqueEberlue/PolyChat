import mongoose from "mongoose";


const channelSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	messages: 
		[{type: mongoose.Schema.Types.ObjectId, ref: "Messages", required: true}],
	members: [
		{type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true}
	],
	admins: [
		{type: mongoose.Schema.Types.ObjectId, ref: "Users"}
	]
}, {collection: "channels"});

export default mongoose.model("Channel", channelSchema);