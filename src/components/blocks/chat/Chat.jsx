import {useEffect, useReducer, useState} from "react";
import {useChannel} from "ably/react";
import MessageList from "@/components/blocks/chat/MessageList";
import ChatInput from "@/components/blocks/chat/ChatInput";
import {useMessages, useRoom} from "@ably/chat/react";
import {MessageEvents} from "@ably/chat";
import {useUser} from "@clerk/nextjs";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const Chat = ( {channelName}) => {
    const {roomStatus, roomError} = useRoom();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    // placeholder user
    const {user} = useUser();

    // usechannel accepts channel name and a function to invoke when new messages are received. pass dispatch.
    const {send} = useMessages({
        listener: (e) => {
            const message = e.message;
            switch (e.type) {
                case MessageEvents.Created: {
                    setMessages((prev) => [...prev, message]);
                    break;
                }
                default: {
                    console.log(e);
                }
            }
        }
    })

    const publishMessage = async (message) => {
        // publish message to ably
        await send({
            text: message,
            metadata: {
                username: user.username,
                avatarUrl: user.imageUrl,
            }
        })
    }

    useEffect(() => {
        if (roomStatus === "failed") {
            toast.error("Failed to join chat room. Please try again later.");
            router.push('/chat/new');
        }
    }, [roomStatus, roomError])

    return (
        <>
            <div className={"overflow-y-auto p-5"}>
                <MessageList messages={messages}/>
            </div>
            <div className={"mt-auto p-5"}>
                <ChatInput onSubmit={publishMessage}/>
            </div>
        </>
    )
}

export default Chat;