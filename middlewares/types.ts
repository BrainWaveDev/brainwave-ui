import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";
export type MiddlewareContext = {
    supabase: SupabaseClient | null
    res: NextResponse | null
}
export type MiddlewareFactory = (next: NextMiddleware, context:MiddlewareContext) => NextMiddleware;

export type Middleware = {
    middleware: MiddlewareFactory,
    path: string[]
}