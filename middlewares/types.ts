import { SupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { Redis } from "@upstash/redis/nodejs";
import { NextMiddleware, NextResponse } from "next/server";
import { MiddlewareContext } from "./utils";
// export type MiddlewareContext = {
//     postReqest: boolean
//     supabaseMiddelwareClient: SupabaseClient | null
//     res: NextResponse | null
//     redis: Redis | null
//     systemConfig?: SystemConfig[],
// }

export type SystemConfig = {
  key:string,
  value:string
}


export type MiddlewareFactory = (next: NextMiddleware, context:MiddlewareContext) => NextMiddleware;

export type Middleware = {
    middleware: MiddlewareFactory,
    path: string[]
}

type FullUser = User & ({
  tier: number | null;
  user_id: string;
  user_name: string | null;
} | undefined);
