import {toast} from "sonner";
import {LoaderCircleIcon, PlusIcon} from "lucide-react";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useRoom} from "@ably/chat/react";

const RandomizerButton = ({client, user, rtClient}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getUsers = async () => {
        setLoading(true);
        const room = await client.rooms.get("chat:online-users");
        const presence = await room.presence.get();

        if (presence.length <= 1) {
            toast.error("Chat is unavailable at the moment. Please try again later.");
            setLoading(false);
            return;
        }

        let second_user;
        do {
            console.log("no other person");
            second_user = presence[Math.floor(Math.random() * presence.length)].clientId;
        } while (second_user === user.id);

        const response = await fetch('/api/db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_user: user.id,
                second_user: second_user
            })
        })

        const data = await response.json();
        setLoading(false);

        router.push("/chat/" + data.insertedId);
    }

    return(
        <>
            {
                !loading && <SidebarMenuButton size={"lg"} className={"font-semibold text-lg flex text-center cursor-pointer"}
                                               onClick={() => getUsers()}>
                    <PlusIcon className={"size-4"}/>
                    New Chat
                </SidebarMenuButton>
            }
            {
                loading && <SidebarMenuButton size={"lg"} className={"font-semibold text-lg flex text-center cursor-pointer"} disabled={true}>
                <LoaderCircleIcon className={"animate-spin"}/>
                New Chat
                </SidebarMenuButton>
            }
        </>
    )
}

export default RandomizerButton;