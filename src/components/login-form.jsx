'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useSignIn} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {error} from "next/dist/build/output/log";
import {toast} from "sonner";

export function LoginForm({className, ...props}) {
  const {signIn, setActive} = useSignIn();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {email, password} = e.target;
    const formData = {
      identifier: email.value,
      password: password.value,
    }

    try {
      const result = await signIn.create(formData);

      if (result.status === 'complete') {
        await setActive({session: result.createdSessionId});
        router.push('/chat/general')
      }
    } catch (e) {
        console.log(error);
        toast.error(e.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign in to your account to continue.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.doe@cit.edu" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
