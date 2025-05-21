import {ChangeEvent, FormEvent, useState} from "react";
import {Input} from "@/components/ui/input";

const ChatInput = ({ onSubmit, disabled}) => {
    const [input, setInput] = useState("");

    const handleChange = (e) => {
        setInput(e.target?.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(input);
        setInput("");
    }
    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={input}
                onChange={handleChange}
                disabled={disabled}
                placeholder= {disabled ? "Chat is disabled" : "Send a message..."}
                className="w-full"
            />
        </form>
    )
}

export default ChatInput;