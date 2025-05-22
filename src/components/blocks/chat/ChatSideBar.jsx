import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
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
import {ChevronDownIcon, ChevronsUpDownIcon, LogOutIcon} from "lucide-react";
import {useRouter} from "next/navigation";

export default function ChatSideBar() {
    const {user} = useUser();
    const {signOut} = useClerk();
    const router = useRouter();

    const handleSignOut = () => {
        console.log("signing out...")

        signOut().then(() => {
            router.push('/')
        })

    }

    return (
        <Sidebar collapsible={"offcanvas"}>
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
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}