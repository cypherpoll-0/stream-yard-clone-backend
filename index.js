const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 5000;

app.use(cors());

// MongoDB setup
// mongoose.connect("mongodb://localhost:27017/liveVideoDB", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });

const VideoSchema = new mongoose.Schema({
	videoUrl: String,
});

const VideoModel = mongoose.model("Video", VideoSchema);

// Socket.IO setup
io.on("connection", (socket) => {
	socket.on("send-video", (videoUrl) => {
		// Save the video URL in the database
		const newVideo = new VideoModel({ videoUrl });
		newVideo.save((err, video) => {
			if (err) {
				console.error("Error saving video:", err);
			} else {
				console.log("Video saved to database:", video);
			}
		});
	});
});

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
