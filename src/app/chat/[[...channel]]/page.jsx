'use client'

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import ChatSideBar from "@/components/blocks/chat/ChatSideBar";
import {Realtime} from "ably";
import Chat from "@/components/blocks/chat/Chat";
import {use, useEffect} from "react";
import {ChatClient} from "@ably/chat";
import {ChatClientProvider, ChatRoomProvider} from "@ably/chat/react";
import {useUser} from "@clerk/nextjs";
import {toast} from "sonner";

const Page = ({params}) => {
    const {user} = useUser();
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

            const notif = await client.channels.get(user?.id);
            console.log(notif);
            await notif.subscribe((message) => {
                toast.info(`${message.data.username} wants to chat with you.`);
            })
        }
        setOnline();
    }, [user])

    return (
        <ChatClientProvider client={chatClient}>
            <ChatRoomProvider id={channelName}>
                <div className={""}>
                    <SidebarProvider>
                        <ChatSideBar client={chatClient} rtClient = {client}/>
                            <main className={"flex flex-1 justify-center"}>
                                <div className={"flex flex-col flex-1 max-w-3xl"}>
                                    <Chat channelName={channelName}/>
                                </div>
                            </main>
                    </SidebarProvider>
                </div>
            </ChatRoomProvider>
        </ChatClientProvider>

    )
}

export default Page;