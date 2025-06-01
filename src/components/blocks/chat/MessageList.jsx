import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {useUser} from "@clerk/nextjs";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";

const MessageList = ({messages, loading}) => {
    const {user} = useUser();
    const length = 10;
    const sizes = ["w-30", "w-50", "w-3xs"]

    const createList = (message) => (
        <li key={message.serial} className={user.id !== message.clientId ? "group my-2 flex justify-between p-3" : "group my-2 flex justify-between p-3 flex-row-reverse"}>
            <div className={user.id !== message.clientId ? "flex items-center" : "flex items-center flex-row-reverse"}>
                <Avatar className={user.id !== message.clientId ? "mr-2" : "ml-2"}>
                    <AvatarImage src={message.metadata.avatarUrl} />
                </Avatar>
                <div className={"flex flex-col"}>
                    <div className={user.id !== message.clientId ? "bg-secondary py-3 px-4 rounded-xl rounded-bl-none max-w-lg w-fit" : "bg-primary py-3 px-4 rounded-xl rounded-br-none max-w-lg w-fit" } style={{}}>
                        <p className={`break-all ${user.id !== message.clientId ? "text-secondary-foreground" : "text-primary-foreground"}`}>{message.text}</p>
                    </div>
                    <div className={"text-xs text-muted-foreground mt-1"}>
                        <span className={"text-primary"}>{user.id !== message.clientId ? message.metadata.username : ""}</span> {`${message.createdAt.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'UTC'
                    })}`}
                    </div>
                </div>
            </div>
        </li>
    )

    return <ul>
        {!loading && user && messages.map(createList)}
        {loading && Array.from({length: length}).map((_, i) => {
            const x = Math.floor(Math.random() * length) * 73 % 101 > 101/2; // randomizer for left or right
            const width = sizes[Math.floor(Math.random() * sizes.length)];

            return (
            <li key={i} className={x ? "group my-2 flex justify-between p-3" : "group my-2 flex justify-between p-3 flex-row-reverse"}>
                <div className={x ? "flex items-end" : "flex items-end flex-row-reverse"}>
                    <Skeleton className={`rounded-full h-9 w-9 ${x ? "mr-2" : "ml-2"}`}/>
                    <div className={"flex flex-col"}>
                        <Skeleton className={x ? `py-3 px-4 rounded-xl rounded-bl-none max-w-lg ${width} h-10` : `py-3 px-4 rounded-xl rounded-br-none max-w-lg ${width} h-10` }/>
                    </div>
                </div>
            </li>
        )}
        ) }
    </ul>
}

export default MessageList;