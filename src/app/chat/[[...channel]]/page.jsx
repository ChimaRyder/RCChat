'use client'

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import ChatSideBar from "@/components/blocks/chat/ChatSideBar";
import {Realtime} from "ably";
import {AblyProvider, ChannelProvider} from "ably/react";
import Chat from "@/components/blocks/chat/Chat";
import {use} from "react";

const Page = ({params}) => {
    // Ably Client
    const client = new Realtime({
        key: process.env.ABLY_SECRET_KEY,
        clientId: 'Alex',

    })
    const channelName = `chat:${use(params).channel}`

    return (
        <AblyProvider client={client}>
            <div className={""}>
                <SidebarProvider>
                    <ChatSideBar/>
                    <ChannelProvider channelName={channelName}>
                        <main className={"w-screen p-5 flex flex-col"}>
                            <Chat channelName={channelName}/>
                        </main>
                    </ChannelProvider>
                </SidebarProvider>
            </div>
        </AblyProvider>

    )
}

export default Page;