import { SocketProvider, useSocket } from "@/context/SocketContext.jsx";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react"
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri";
import { Socket, WebSocket } from "socket.io-client";
// import { Socket } from "socket.io-client";

const MessageBar = ()  => {
        const emojiRef = useRef();
        const socket = useSocket();
        const {selectedChatType, selectedChatData, selectedChatMessages,userInfo} = useAppStore()

        const [message,setMessage] = useState('')
        const [emojiPickerOpen,setEmojiPickerOpen] = useState(false);

        const handleAddEmoji = (emoji) => {
            setMessage((msg) => msg+emoji.emoji)
        }

       
        useEffect(() => {
            function handleClickOutside(event) {
                if(emojiRef.current && !emojiRef.current.contains(event.target)) {
                    setEmojiPickerOpen(false);
                }
            }

            document.addEventListener("mousedown",handleClickOutside);
            return() => {
                document.removeEventListener("mousedown",handleClickOutside);
            }

        },[emojiRef])


        const handleSendMessage = async() => {
            try{
                console.log({selectedChatMessages})
            console.log(socket)
            if(selectedChatType==='contact'){
                socket.emit('sendMessage',{
                    sender: userInfo.id,
                    content: message,
                    recipient:selectedChatData._id,
                    messageType:'text',
                    fileUrl:undefined,
                });
            }
        }
        catch(error){
            console.error(error)
        }
    }



    return (
        <div className="h-[10vw] bg-[#1c1d25] flex justify-center items-center px-10 mb-5 pl-[50px] gap-3">
            <div className="flex-1 flex bg-[#2a2b33] items-center gap-5 pr-5">
                <input type="text" className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)}></input>

                {/* <button className="text-neutral-500 focus:border:none focus:outline-none focus:text-white duration-300 transition-all">
                    <GrAttachment className="text-2xl"/>
                </button> */}
                
                <div className="relative">
                    {/* <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={()=> setEmojiPickerOpen(true)}>
                        <RiEmojiStickerLine className="text-2xl"/>
                    </button> */}

                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} ></EmojiPicker>
                    </div>
                </div>
            </div>

            <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg[#741bda] focus:outline-none focus:text-white duration-300 transition-all" onClick={handleSendMessage}>
                        <IoSend className="text-2xl"/>
                    </button>

     

        </div>
    )
}

export default MessageBar