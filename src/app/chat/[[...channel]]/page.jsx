'use client'

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import ChatSideBar from "@/components/blocks/chat/ChatSideBar";
import {Realtime} from "ably";
import {AblyProvider, ChannelProvider} from "ably/react";
import Chat from "@/components/blocks/chat/Chat";
import {use, useEffect} from "react";
import {ChatClient} from "@ably/chat";
import {ChatClientProvider, ChatRoomProvider} from "@ably/chat/react";
import chat from "@/components/blocks/chat/Chat";

const Page = ({params}) => {
    // Ably Client
    const client = new Realtime({
        authUrl: '/api/ably',
        autoConnect: typeof window !== 'undefined',
    })
    const chatClient = new ChatClient(client);

    chatClient.connection.onStatusChange((change) => console.log(`Connection is currently ${change.current}`));
    const channelName = `${use(params).channel}`;

    useEffect(() => {
        const setOnline = async () => {
            const room = await chatClient.rooms.get("online-users")
            await room.presence.enter();
        }
        setOnline();
    }, [])

    return (
        <ChatClientProvider client={chatClient}>
            <ChatRoomProvider id={channelName}>
                <div className={""}>
                    <SidebarProvider>
                        <ChatSideBar client={chatClient}/>
                            <main className={"w-screen p-5 flex flex-col px-100"}>
                                <Chat channelName={channelName}/>
                            </main>
                    </SidebarProvider>
                </div>
            </ChatRoomProvider>
        </ChatClientProvider>

    )
}

export default Page;