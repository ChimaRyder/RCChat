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

    const getRooms = () => {
        fetch('/api/db', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(rooms => {
                const dbChats = rooms.map(room => {
                    const user = room.users.filter(user => user !== user.id)[0]
                    // const userData =

                    return {
                        id: room._id,
                        // user: ,
                    }
                })
                console.log(dbChats)
                setChats(dbChats)
            })
            .catch(err => {
                console.log(err)
            })
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
                                <SidebarMenuButton size={"lg"} className={""} onClick={() => router.push(`/chat/${chat.id}`)}>
                                    <Avatar>
                                        <AvatarImage src={user?.imageUrl}/>
                                    </Avatar>
                                    <div className={"flex flex-col flex-1"}>
                                        <div className={"flex flex-row justify-between items-start"}>
                                            <p className={"font-semibold"}>General</p>
                                            <p className={"font-light text-xs"}>1:23 PM</p>
                                        </div>
                                        <p className={"text-muted-foreground text-xs"}>Seriously?</p>
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
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => getRooms()}>
                                        Get Rooms
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