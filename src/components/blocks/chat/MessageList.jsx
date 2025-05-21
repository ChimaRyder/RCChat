import {Avatar, AvatarImage} from "@/components/ui/avatar";

const MessageList = ({messages}) => {
    const createList = (message) => (
        <li key={message.id} className={"bg-slate-50 group my-2 flex justify-between p-3"}>
            <div className={"flex items-center"}>
                <Avatar className={"mr-2"}>
                    <AvatarImage src={message.data.avatarUrl} />
                </Avatar>
                <p>{message.data.message}</p>
            </div>
        </li>
    )

    return <ul>{messages.map(createList)}</ul>
}

export default MessageList;