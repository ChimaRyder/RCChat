'use client'
import {CupSoda, GalleryVerticalEnd} from "lucide-react";
import {LoginForm} from "@/components/login-form";
import {useClerk} from "@clerk/nextjs";
import {useEffect, useState} from "react";
import SodaIcon from "@/components/SodaIcon";

export default function Home() {
    const clerk = useClerk();
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const checkAuth = async () => {
            await clerk.redirectWithAuth('/chat/new');
        }

        checkAuth();
        setLoading(false);
    }, [clerk]);
  return (

      <div className="grid min-h-svh lg:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-10">
              <div className="flex justify-center gap-2 md:justify-start">
                  <a href="#" className="flex items-center gap-2 font-medium">
                      <div
                          className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                          <SodaIcon className="size-4" />
                      </div>
                      RC Chat
                  </a>
              </div>
              <div className="flex flex-1 items-center justify-center">
                  <div className="w-full max-w-xs">
                      <LoginForm authLoading={loading} />
                  </div>
              </div>
          </div>
          <div className="bg-muted relative hidden lg:block">
              <img
                  src="/jarritos-mexican-soda-kFEb8yigiuQ-unsplash.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
      </div>
  );
}
