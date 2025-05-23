import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarHeader,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
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
import {usePresence, useRoom} from "@ably/chat/react";
import {toast} from "sonner";

export default function ChatSideBar({client, ...props}) {
    const {user} = useUser();
    const {signOut} = useClerk();
    const router = useRouter();


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
                console.log(rooms)
            })
            .catch(err => {
                console.log(err)
            })


    }

    const getUsers = async () => {
        const room = await client.rooms.get("online-users");
        const presence = await room.presence.get();

        if (presence.length <= 1) {
            toast.error("Chat is unavailable at the moment. Please try again later.");
            return;
        }

        let second_user;
        do {
            second_user = presence[Math.floor(Math.random() * presence.length)].clientId;
        } while (second_user === user.id);

        const result = await fetch('/api/db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_user: user.id,
                second_user: second_user
            })
        })

        const data = await result.json();
        console.log(data)
    }

    return (
        <Sidebar collapsible={"offcanvas"}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size={"lg"} className={"font-semibold text-lg flex text-center"} onClick={() => getUsers()}>
                            <PlusIcon className={"size-4"}/>
                            New Chat
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    dffa
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