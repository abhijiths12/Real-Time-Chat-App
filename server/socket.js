
import  { Server as SockerIOServer, Socket } from "socket.io"
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
    const io = new SockerIOServer(server, {

    
    cors: {
        origin:process.env.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
    },

});

const userSocketMap = new Map();

const disconnect = (socket) =>{
        console.log('client disconnected')
        for(const [userId,socketId] of userSocketMap.entries()) {
            if( socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
}

const sendMessage = async(message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient)

    const createdMessage = await Message.create(message)

    const messageData = await Message.findById(createdMessage._id).populate('sender','id email firstName lastName images color').populate("recipient","id email firstName lastName images color")

    // console.log(messageData)

    if(recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    if(senderSocketId){
        io.to(senderSocketId).emit("receiveMessage", messageData);
    }
}

io.on('connection',(socket) => {
    const userId = socket.handshake.query.userId;

    if(userId) {
        userSocketMap.set(userId, socket.id);
        console.log('user connected')
    } else {
        console.log('userid not provided during connection')

    }
    socket.on('sendMessage',sendMessage)
    socket.on("disconnect",() => disconnect(socket))
})
};


export default setupSocket