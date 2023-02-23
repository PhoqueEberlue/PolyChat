import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	channels:
		[{type: mongoose.Schema.Types.ObjectId, ref: "Channels"}],
}, {collection: "users"});

const Users = mongoose.model("User", UsersSchema);

export {UsersSchema, Users};
