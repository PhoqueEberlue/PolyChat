import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema({
	author:
		{type: mongoose.Schema.Types.ObjectId, ref: "Users"},
	date: {
		type: Date,
		required: true
	},
	content: {
		type: String,
		required: true
	}
});

const Messages = mongoose.model("Messages", MessagesSchema);

export {MessagesSchema as MessagesSchema, Messages};
