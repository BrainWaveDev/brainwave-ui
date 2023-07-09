import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Redis } from "@upstash/redis/nodejs";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";
export type MiddlewareContext = {
    postReqest: boolean
    supabaseMiddelwareClient: SupabaseClient | null
    res: NextResponse | null
    redis: Redis | null
    systemConfig?: SystemConfig 
}

export type SystemConfig = {
    rateLimit: {
        freeTire: {
            limit: number
            time: number
        }
    }
}

export type MiddlewareFactory = (next: NextMiddleware, context:MiddlewareContext) => NextMiddleware;

export type Middleware = {
    middleware: MiddlewareFactory,
    path: string[]
}