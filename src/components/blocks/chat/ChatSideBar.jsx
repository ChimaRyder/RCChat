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
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {useClerk, useUser} from "@clerk/nextjs";
import {ChevronDownIcon, ChevronsUpDownIcon, LogOutIcon, PlusIcon, UserIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import RandomizerButton from "@/components/blocks/chat/RandomizerButton";
import {useEffect, useState} from "react";
import {useChatConnection, useRoom} from "@ably/chat/react";
import {Skeleton} from "@/components/ui/skeleton";
import {AccountSettings, AccountSettingsButton} from "@/components/blocks/chat/AccountSettings";
import {Dialog} from "@/components/ui/dialog";

export default function ChatSideBar({client, rtClient, channel, setPageLoading, ...props}) {
    const {user} = useUser();
    const {signOut} = useClerk();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true);

    const handleSignOut = () => {
        setPageLoading(true);
        console.log("signing out...")

        try {
            // leave chat:online-users and chat:id
            console.log(client)
            rtClient.channels.get(`chat:${user?.id}`).unsubscribe();
            rtClient.connection.close();
        } catch (e) {
            console.log(e)
        } finally {
            signOut().then(() => {
                router.push('/')
            })
            setPageLoading(false);
        }
    }

    const getRooms = async () => {
        if (!user) {
            return;
        }
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
        setTimeout(() => {
            setLoading(false);
        }, 1000)
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
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <SidebarMenu>
                        {!loading && chats.map(chat => ( chat.id !== channel[0] ?
                            <SidebarMenuItem key={chat.id}>
                                <SidebarMenuButton size={"lg"} className={"cursor-pointer"} onClick={() => {
                                    router.push(`/chat/${chat.id}`);
                                }}>
                                    <Avatar>
                                        <AvatarImage src={chat.user?.imageUrl}/>
                                    </Avatar>
                                    <div className={"flex flex-col flex-1"}>
                                        <div className={"flex flex-row justify-between items-start"}>
                                            <p className={"font-semibold"}>{chat.user?.username}</p>
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                                </SidebarMenuItem> :
                                <SidebarMenuItem key={chat.id}>
                                    <SidebarMenuButton size={"lg"} className={"cursor-pointer bg-primary text-primary-foreground"} onClick={() => router.push(`/chat/${chat.id}`)}>
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

                        {loading &&
                            <>
                                <SidebarMenuSkeleton/>
                                <SidebarMenuSkeleton/>
                                <SidebarMenuSkeleton/>
                                <SidebarMenuSkeleton/>
                                <SidebarMenuSkeleton/>
                                <SidebarMenuSkeleton/>
                                <SidebarMenuSkeleton/>
                                <SidebarMenuSkeleton/>
                                <SidebarMenuSkeleton/>
                            </>
                        }
                        { loading &&
                            Array.from({length: 7}).map((e, i) => (
                                    <SidebarMenuItem key={i}>
                                        <SidebarMenuButton disabled={true} size={"lg"}>
                                            <Skeleton className={"rounded-full h-8 w-8"}/>
                                            <div className={"flex flex-col flex-1"}>
                                                <SidebarMenuSkeleton/>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                        }

                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size={"lg"} className={"cursor-pointer"}>
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
                                    <DropdownMenuLabel className={"flex flex-row justify-between items-center gap-2"}>
                                        <Avatar>
                                            <AvatarImage src={user?.imageUrl}/>
                                        </Avatar>
                                        <div className={"flex flex-col"}>
                                            <p className={"font-medium"}>{user?.username}</p>
                                            <p className={"text-muted-foreground text-xs"}>{user?.primaryEmailAddress.emailAddress}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuGroup>
                                        {/*<DropdownMenuItem className={"cursor-pointer"}>*/}
                                        {/*    <UserIcon/>*/}
                                        {/*    Account*/}
                                        {/*</DropdownMenuItem>*/}
                                        <AccountSettingsButton/>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className={"cursor-pointer"} onClick={() => handleSignOut()}>
                                            <LogOutIcon/>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AccountSettings setOpen={setOpen}/>
                        </Dialog>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}