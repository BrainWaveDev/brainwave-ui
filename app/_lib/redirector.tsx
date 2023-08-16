"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useIsClient } from "./isClientCtxProvider";
import { useEffect, useState } from "react";
import { getSession } from "./auth";

const Redirector = () => {
    const isClient = useIsClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { session } = getSession();
    const [code,setCode] = useState<string | null>(null);

    useEffect(() => {
        if (isClient) {
            let code = searchParams?.get('code')
            setCode(code || null)
        }
    }, [isClient, router]);

    useEffect(()=>{
        if(isClient && code && session?.user){
            router.push('/chat')
        }

    },[code,session,isClient])

    return <></>;
};

export default Redirector