import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSkeleton, SidebarSeparator
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {useClerk, useUser} from "@clerk/nextjs";
import {ChevronDownIcon, ChevronsUpDownIcon, LogOutIcon, PlusIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import RandomizerButton from "@/components/blocks/chat/RandomizerButton";
import {useEffect, useState} from "react";

export default function ChatSideBar({client, rtClient, ...props}) {
    const {user} = useUser();
    const {signOut} = useClerk();
    const router = useRouter();
    const [chats, setChats] = useState([])

    const handleSignOut = () => {
        console.log("signing out...")

        signOut().then(() => {
            router.push('/')
        })

    }

    const getRooms = async () => {
        const res = await fetch('/api/db', {})
        const rooms = await res.json()

        const dbChats = await Promise.all(
            rooms.map(async room => {
                const second_user = room.users.find(u => u !== user?.id);
                const res = await fetch(`/api/clerk?user=${second_user}`);
                const userData = await res.json();

                return {
                    id: room._id,
                    user: userData,
                }
            })
        )

        setChats(dbChats)
    }

    useEffect(() => {
        getRooms();
    }, [user]);

    return (
        <Sidebar collapsible={"offcanvas"}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <RandomizerButton client={client} user={user} rtClient={rtClient}/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator/>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <SidebarMenu>
                        {chats.map(chat => (
                            <SidebarMenuItem key={chat.id}>
                                <SidebarMenuButton size={"lg"} className={"cursor-pointer"} onClick={() => router.push(`/chat/${chat.id}`)}>
                                    <Avatar>
                                        <AvatarImage src={chat.user?.imageUrl}/>
                                    </Avatar>
                                    <div className={"flex flex-col flex-1"}>
                                        <div className={"flex flex-row justify-between items-start"}>
                                            <p className={"font-semibold"}>{chat.user?.username}</p>
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size={"lg"} className={""}>
                                    <Avatar>
                                        <AvatarImage src={user?.imageUrl}/>
                                    </Avatar>
                                    <div className={"flex flex-col"}>
                                        <p className={"font-medium"}>{user?.username}</p>
                                        <p className={"text-muted-foreground text-xs"}>{user?.primaryEmailAddress.emailAddress}</p>
                                    </div>
                                    <ChevronsUpDownIcon className={"size-4 ml-auto"}/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side={"right"}>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => handleSignOut()}>
                                        <LogOutIcon/>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}