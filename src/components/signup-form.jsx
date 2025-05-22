'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useSignUp} from "@clerk/nextjs";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";
import {toast} from "sonner";
import {useState} from "react";
import {redirect} from "next/navigation";
import {cn} from "@/lib/utils";

export function SignupForm({className, ...props}) {
    const {signUp, setActive} = useSignUp();
    const [pendingVerification, setPendingVerification] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {username, email, password} = e.target;
        const formData = {
            username: username.value,
            emailAddress: email.value,
            password: password.value,
        }

        try {
            const user = await signUp.create(formData);

            await signUp.prepareEmailAddressVerification({strategy: 'email_code'});
            setPendingVerification(true);
            toast.success("Verification email sent. Please check your inbox.");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        const {otp} = e.target;
        const code = otp.value;

        try {
            const result = await signUp.attemptEmailAddressVerification({code});

            if (result.status === 'complete') {
                toast.success("Email address verified. Welcome to RC Chat!.");
                await setActive({session : result.createdSessionId });
                redirect('/chat/general')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <>
        {
            !pendingVerification && <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Sign Up</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Join the community and chat with other users.
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="text" placeholder="john.doe" required/>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@cit.edu" required/>
                    </div>
                    <div className="grid gap-3">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                                Forgot your password?
                            </a>
                        </div>
                        <Input id="password" type="password" required/>
                    </div>
                    <div id={"clerk-captcha"}></div>
                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                </div>
                <div className="text-center text-sm">
                    By signing up, you agree to our <a href="#" className="underline underline-offset-4">Terms of
                    Service</a> and <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
                </div>
            </form>
        }

        {
            pendingVerification && <form onSubmit={handleVerify} className={"flex flex-col gap-6"}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Verification Code Sent</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Check your inbox for the verification code.
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className={"flex justify-center"}>
                        <InputOTP maxLength={6} name="otp">
                            <InputOTPGroup>
                                <InputOTPSlot index={0}/>
                                <InputOTPSlot index={1}/>
                                <InputOTPSlot index={2}/>
                            </InputOTPGroup>
                            <InputOTPSeparator/>
                            <InputOTPGroup>
                                <InputOTPSlot index={3}/>
                                <InputOTPSlot index={4}/>
                                <InputOTPSlot index={5}/>
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <Button type="submit" className="w-full">
                        Verify
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/" className="underline underline-offset-4">
                        Login
                    </a>
                </div>
            </form>
        }
    </>
);
}

