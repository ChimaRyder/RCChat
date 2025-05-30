import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {useUser} from "@clerk/nextjs";

const MessageList = ({messages}) => {
    const {user} = useUser();
    const createList = (message) => (
        <li key={message.serial} className={user.id !== message.clientId ? "group my-2 flex justify-between p-3" : "group my-2 flex justify-between p-3 flex-row-reverse"}>
            <div className={user.id !== message.clientId ? "flex items-center" : "flex items-center flex-row-reverse"}>
                <Avatar className={user.id !== message.clientId ? "mr-2" : "ml-2"}>
                    <AvatarImage src={message.metadata.avatarUrl} />
                </Avatar>
                <div className={"flex flex-col ml-2"}>
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

    return <ul>{messages.map(createList)}</ul>
}

export default MessageList;