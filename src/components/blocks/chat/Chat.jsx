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
    const {send, getPreviousMessages} = useMessages({
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

    useEffect(() => {
        if (getPreviousMessages) {
            getPreviousMessages({limit: 20})
                .then((res) => {
                    setMessages(res.items.reverse());
                })
        }
    }, [getPreviousMessages])

    return (
        <>
            {channelName !== "chat:new" ?
            <div className={"overflow-y-auto p-5"}>
                <MessageList messages={messages}/>
            </div> :
            <div className={"flex flex-col gap-2 items-center justify-center flex-1"}>
                <img src={'/soda-can.png'} className={""} alt={"soda can"} width={150}/>
                <p className={"text-center text-2xl font-bold"}>
                    Welcome to RC Chat!
                </p>
                <p className={"text-center text-lg"}>
                    Press "New Chat" to start a new chat.
                </p>
            </div>
            }
            <div className={"mt-auto p-5"}>
                <ChatInput onSubmit={publishMessage} disabled={channelName === "chat:new"}/>
            </div>
        </>
    )
}

export default Chat;