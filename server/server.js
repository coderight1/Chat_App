import express from "express";
import cors from 'cors';
import { Server } from "socket.io";
import http from "http";
import { log } from "console";

const app = express();
const httpServer = http.createServer(app);
// const io = new Server(httpServer,{
//     cors:{
//         // origin:"https://muddy-tree-9579.on.fleek.co/",
//         origin:[`*`],
//         // origin:"http://localhost:5173",
//         // origin:"https://master--papaya-platypus-2f50d7.netlify.app/",
//         methods:["GET","PUT"]
//     }
// });
const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
    allowEIO3: true,
  });

io.on("connection",(socket)=>{console.log(socket.id)

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User ID : ${socket.id} joined room : ${data}`); 
    })

    socket.on("send_message",(data)=>{console.log("send message data",data)
    socket.to(data.room).emit("receive_message",data)
    });

    socket.on("disconnect",()=>{
        console.log("User disconnected...",socket.id);
    })
})



app.use(cors());

httpServer.listen(1000, () => {
   console.log("server is running on the port 1000");
});
