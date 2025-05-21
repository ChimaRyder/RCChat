import {useReducer} from "react";
import {useChannel} from "ably/react";
import MessageList from "@/components/blocks/chat/MessageList";
import ChatInput from "@/components/blocks/chat/ChatInput";

const ADD = 'ADD'

const reducer = (prev, event) => {
    switch (event.name) {
        // appends message to messages
        case ADD:
            return [...prev, event]
    }
}

const Chat = ( {channelName}) => {

    // placeholder user
    const user = {
        imageUrl: 'https://ui-avatars.com/api/?name=alex',
    }

    const [messages, dispatch] = useReducer(reducer, [])
    // usechannel accepts channel name and a function to invoke when new messages are received. pass dispatch.
    const {channel, publish} = useChannel(channelName, dispatch);

    const publishMessage = (message) => {
        // publish message to ably
        publish({
            name: ADD,
            data: {
                message,
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