/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to host your server on Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually
 * instantiate a Colyseus Server as documented here:
 *
 * See: https://docs.colyseus.io/server/api/#constructor-options
 */
// import { listen } from "@colyseus/tools";

// // Import Colyseus config
// import app from "./app.config";

// // Create and listen on 2567 (or PORT environment variable.)
// listen(app);

import { Server, logger } from "colyseus";
import { createServer } from "http";
import express from "express";
import { MyRoom } from "./rooms/MyRoom";
import { monitor } from "@colyseus/monitor";
import { connect } from "./config/database.config";

const port = Number(process.env.port) || 3000;

const app = express();
app.use(express.json());

//Kết nối database
connect().then(async () => {
  console.log('ket noi db thanh cong')
});
  
const gameServer = new Server({
  server: createServer(app),
  // driver: new MongooseDriver("mongodb://127.0.0.1:27017/SuperBrainTest")
});

//Đăng ký 1 phòng mới
gameServer.define('my_room_name', MyRoom);
app.use("/colyseus", monitor());

gameServer.listen(port);
