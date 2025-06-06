import {SettingsIcon, UserIcon} from "lucide-react";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {
    DialogClose,
    DialogContent, DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {useUser} from "@clerk/nextjs";
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {useRef, useState} from "react";
import {toast} from "sonner";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTheme} from "next-themes";

function AccountSettingsButton() {
    return (
        <>
            <DialogTrigger asChild>
                <DropdownMenuItem className={"cursor-pointer"}>
                    <SettingsIcon/>
                    Settings
                </DropdownMenuItem>
            </DialogTrigger>

        </>
    )
}

function AccountSettings ({setOpen}) {
    const profileImage = useRef(null);
    const {user} = useUser();
    const [selected, setSelected] = useState("");
    const [file, setFile] = useState(null);
    const {setTheme, theme} = useTheme();
    const [themeValue, setThemeValue] = useState(theme);

    const handleImageChange = () => {
        profileImage.current.click();
    }

    const handleImageSelected = (event) => {
        const image = event.target.files[0];

        if (image) {
            if (!image.type.includes("image")) {
                toast.error("Please choose an Image.");
                return;
            } else {
                const imageURL = URL.createObjectURL(image);
                setFile(image);
                setSelected(imageURL);
            }
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        try {
            let params = {};

            // Check username to update
            if (form.username && form.username?.value !== user?.username) {
                params.username = form.username.value;
            }

            const res = await user.update(params);

            // Check profile photo to update
            if (selected !== "") {
                const response = await user.setProfileImage({file: file});
            }

            setOpen(false);
            toast.success("Your profile has been updated!");
        } catch (error) {
            console.log(error);
        }
    }

    return (
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader className={"mb-3"}>
                        <DialogTitle tag="h4">Settings</DialogTitle>
                        <DialogDescription>Personalize your account.</DialogDescription>
                    </DialogHeader>

                    {/*Main Form*/}

                    <Tabs default={"profile"}>
                        <TabsList className={"w-full mb-3"}>
                            <TabsTrigger value={"profile"}>Profile</TabsTrigger>
                            <TabsTrigger value={"other"}>Other</TabsTrigger>
                        </TabsList>
                        <TabsContent value={"profile"} className={"flex flex-col gap-5"}>
                            <div className={"flex flex-row items-center gap-2"}>
                               <Image
                                   src={selected.length === 0 ? user.imageUrl : selected}
                                   width={100}
                                   height={100}
                                   alt={"profile picture"}
                                   className={"rounded-lg"}
                                   loading="lazy"
                               />
                               <div className={"ml-2"}>
                                   <Button type={"button"} onClick={() => handleImageChange()}>Change Avatar</Button>
                                   <p className={"text-sm text-muted-foreground mt-1"}>JPG, GIF, or PNG.</p>
                               </div>
                               {/*Hidden Input*/}
                               <Input
                                   type={"file"}
                                   id={"profileImage"}
                                   ref={profileImage}
                                   className={"hidden"}
                                   onChange={(e) => handleImageSelected(e)}
                               />
                            </div>

                            <div className={"flex flex-row justify-between gap-3 mb-3"}>
                                <div className={"flex-1"}>
                                    <Label htmlFor={"username"} className={"mb-2 font-semibold"}>Username</Label>
                                    <Input
                                        placeholder={"Username"}
                                        type={"text"}
                                        name={"username"}
                                        id={"username"}
                                        defaultValue={user?.username}
                                        disabled={true}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                    <Label htmlFor={"email"} className={"mb-2 font-semibold"}>Email</Label>
                                    <Input
                                        placeholder={"Email"}
                                        type={"email"}
                                        name={"email"}
                                        id={"email"}
                                        defaultValue={user?.primaryEmailAddress.emailAddress}
                                        disabled
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value={"other"}>
                            <div className={"flex flex-row justify-between mb-3"}>
                                <Label className={"font-bold"}>Theme</Label>
                                <Select
                                    value={themeValue}
                                    onValueChange={(theme) => {
                                        setTheme(theme);
                                        setThemeValue(theme);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={"Select a theme..."}></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"light"}>Light</SelectItem>
                                        <SelectItem value={"dark"}>Dark</SelectItem>
                                        <SelectItem value={"system"}>System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/*End of Main Form*/}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
    )

}

export {AccountSettingsButton, AccountSettings};