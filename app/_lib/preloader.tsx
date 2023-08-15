"use client"

import { useRouter } from "next/navigation";
import { useIsClient } from "./isClientCtxProvider";
import { useEffect } from "react";

const PreLoader = () => {
    const isClient = useIsClient();
    const router = useRouter();

    useEffect(() => {
        if (isClient) {
            router.prefetch("/chat");
        }
    }, [isClient, router]);

    return <></>;
};

export default PreLoader