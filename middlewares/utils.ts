import { SupabaseClient, createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Redis } from "@upstash/redis/nodejs";
import { SystemConfig } from "./types";
import { Database } from "@/types/supabase";
import { NextRequest, NextResponse } from "next/server";
import { HTTPError } from "@/utils/server/error";

export function guard(obj: unknown) {
    return {
        throw(error: Error) {
            if (obj != null && obj != undefined) {
                return obj;
            } else {
                throw error;
            }
        }
    }
}


type EdgeSupabaseClinet = ReturnType<typeof createMiddlewareSupabaseClient<Database>>;

export class MiddlewareContext {
    public req: NextRequest | undefined;
    public res: NextResponse | undefined;
    public postRequest: boolean;
    supabaseMiddlewareClient: EdgeSupabaseClinet | null;
    redis: Redis | null;
    systemConfig?: SystemConfig[];
    

    constructor() {
        this.postRequest = false;
        this.redis = null;
        this.supabaseMiddlewareClient = null;
    }

    setPostRequest(postRequest: boolean) {
        this.postRequest = postRequest;
    }

    getPostRequest() {
        return this.postRequest;
    }

    getRedis() {
        if (this.redis == null) {
            const redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL!,
                token: process.env.UPSTASH_REDIS_REST_TOKEN!
            })
            this.redis = redis;
        }

        return this.redis;
    }

    getSupabaseClient() {
        if (this.supabaseMiddlewareClient == null) {
            guard(this.req).throw(new HTTPError("req is null", 500));
            guard(this.res).throw(new HTTPError("res is null", 500));
            const supabase = createMiddlewareSupabaseClient<Database>({ req: this.req!, res: this.res! });       
            this.supabaseMiddlewareClient = supabase;
        }
    
        return this.supabaseMiddlewareClient;
    }


}