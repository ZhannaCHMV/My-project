import express from "express";
import { postsRoutes } from "./routes/posts.js";
import { userRoutes } from "./routes/users.js";
import bodyParser from "body-parser";
import cors from "cors";
import { likeRoutes } from './routes/likes.js'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { handleSocket } from './socket.js'
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Express Nodemon!");
});
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
app.set('io', io)
handleSocket(io)
postsRoutes(app)
userRoutes(app)
likeRoutes(app)

export { server as app };
