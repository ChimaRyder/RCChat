import {useReducer, useState} from "react";
import {useChannel} from "ably/react";
import MessageList from "@/components/blocks/chat/MessageList";
import ChatInput from "@/components/blocks/chat/ChatInput";
import {useMessages, useRoom} from "@ably/chat/react";
import {MessageEvents} from "@ably/chat";
import {useUser} from "@clerk/nextjs";

const Chat = ( {channelName}) => {
    const {} = useRoom();
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