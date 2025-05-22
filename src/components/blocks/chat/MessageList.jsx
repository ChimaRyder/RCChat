import {Avatar, AvatarImage} from "@/components/ui/avatar";

const MessageList = ({messages}) => {
    const createList = (message) => (
        <li key={message.serial} className={"group my-2 flex justify-between p-3"}>
            <div className={"flex items-center"}>
                <Avatar className={"mr-2"}>
                    <AvatarImage src={message.metadata.avatarUrl} />
                </Avatar>
                <div className={"flex flex-col ml-2"}>
                    <div className={"bg-slate-300 py-3 px-4 rounded-xl rounded-bl-none max-w-lg w-fit"}>
                        <p className={"break-all"}>{message.text}</p>
                    </div>
                    <div className={"text-xs text-muted-foreground mt-1"}>
                        <span className={"text-primary"}>{message.metadata.username}</span> {`${message.createdAt.toLocaleTimeString('en-US', {
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