'use client'

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import ChatSideBar from "@/components/blocks/chat/ChatSideBar";
import {Realtime} from "ably";
import Chat from "@/components/blocks/chat/Chat";
import {use, useEffect, useState} from "react";
import {ChatClient} from "@ably/chat";
import {ChatClientProvider, ChatRoomProvider, useRoom} from "@ably/chat/react";
import {useUser} from "@clerk/nextjs";
import {toast} from "sonner";
import SodaIcon from "@/components/SodaIcon";

const Page = ({params}) => {
    const {user} = useUser();
    const [loading, setLoading] = useState(true);
    // Ably Client
    const client = new Realtime({
        authUrl: '/api/ably',
        autoConnect: typeof window !== 'undefined',
    })
    const chatClient = new ChatClient(client);

    chatClient.connection.onStatusChange((change) => {
        console.log(`Connection is currently ${change.current}`)
    });
    const channelName = `chat:${use(params).channel}`;

    useEffect(() => {
        const setOnline = async () => {
            const room = await chatClient.rooms.get("chat:online-users")
            const presence = await room.presence.isUserPresent(user?.id);
            if (!presence) {
                await room.presence.enter();
            }

            if (user) {
                const notif = client.channels.get(`chat:${user?.id}`);
                const res = await notif.subscribe((message) => {
                    toast.info(`${message.data.username} wants to chat with you.`);
                })
            }
        }
        setOnline();
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }, [user])



    return (
        <ChatClientProvider client={chatClient}>
            <ChatRoomProvider id={channelName} release={true}>
                <div className={""}>
                    <SidebarProvider>
                        {!loading &&
                            <>
                            <ChatSideBar client={chatClient} rtClient = {client} channel={use(params).channel} setPageLoading={setLoading}/>
                            <SidebarTrigger/>
                            <main className={"flex flex-1 justify-center"}>
                                <div className={"flex flex-col flex-1 h-screen max-w-3xl"}>
                                    <Chat channelName={channelName}/>
                                </div>
                            </main>
                            </>
                        }
                        {loading &&
                            <div className={"flex flex-col flex-1 justify-center items-center"}>
                                <div>
                                    <SodaIcon className={"text-primary size-50 animate-bounce"}/>
                                </div>
                            </div>
                        }
                    </SidebarProvider>
                </div>
            </ChatRoomProvider>
        </ChatClientProvider>

    )
}

export default Page;