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
import RandomizerButton from "@/components/blocks/chat/RandomizerButton";

export default function ChatSideBar({client, rtClient, ...props}) {
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
                console.log(rooms.map(room => room._id));
            })
            .catch(err => {
                console.log(err)
            })


    }

    return (
        <Sidebar collapsible={"offcanvas"}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <RandomizerButton client={client} user={user} rtClient={rtClient}/>
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