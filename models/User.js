/** @format */

const mongoose = require("mongoose");

mongoose.connect(
	"mongodb+srv://apagoaga02:QGexhD4HCvr0Q4bB@cluster0.qafw2pk.mongodb.net/sw202203",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

var userSchema = mongoose.Schema({
	//uid: String,
//	token: String,
	email: String,
	name: String,
//	gender: String,
	pic: String,
});

module.exports = mongoose.model("User", userSchema);
