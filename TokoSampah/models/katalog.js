var mongoose = require("mongoose");

var katalogSchema = new mongoose.Schema({
	nama: String,
	harga: String,
	foto: String,
	deskripsi: String
});

module.exports = mongoose.model("Katalog", katalogSchema);