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

function AccountSettings () {
    const profileImage = useRef(null);
    const {user} = useUser();
    const [selected, setSelected] = useState("");

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
                console.log(imageURL);
                setSelected(imageURL);
            }
        }

    }

    return (
        <form>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle tag="h4">Settings</DialogTitle>
                    <DialogDescription>Personalize your account.</DialogDescription>
                </DialogHeader>

                {/*Main Form*/}

                <Tabs default={"profile"}>
                    <TabsList className={"w-full mb-3"}>
                        <TabsTrigger value={"profile"}>Profile</TabsTrigger>
                        <TabsTrigger value={"account"}>Account</TabsTrigger>
                    </TabsList>
                    <TabsContent value={"profile"} className={"flex flex-col gap-5"}>
                        <div className={"flex flex-row items-center gap-2"}>
                           <Image
                               src={selected.length === 0 ? user.imageUrl : selected}
                               width={100}
                               height={100}
                               alt={"profile picture"}
                               className={"rounded-lg"}
                           />
                           <div className={"ml-2"}>
                               <Button onClick={() => handleImageChange()}>Change Avatar</Button>
                               <p className={"text-sm text-muted-foreground mt-1"}>JPG, GIF, or PNG.</p>
                           </div>
                           {/*Hidden Input*/}
                           <Input
                               type={"file"}
                               ref={profileImage}
                               className={"hidden"}
                               onChange={(e) => handleImageSelected(e)}
                           />
                        </div>

                        <div>
                            <Label htmlFor={"username"} className={"mb-2 font-semibold"}>Username</Label>
                            <Input
                                placeholder={"Username"}
                                type={"text"}
                                name={"username"}
                                id={"username"}
                                defaultValue={user?.username}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value={"account"}>
                        this is the account tab
                    </TabsContent>
                </Tabs>

                {/*End of Main Form*/}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <Button>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </form>
    )

}

export {AccountSettingsButton, AccountSettings};