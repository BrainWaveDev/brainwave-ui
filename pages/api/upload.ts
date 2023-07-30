import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const aenoKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const free_user_storage_limit = process.env.FREE_USER_STORAGE_LIMIT_IN_MB
const pro_user_strorage_limit = process.env.PRO_USER_STORAGE_LIMIT_IN_MB


export const config = {
    runtime: 'edge'
};

export default async function handler(request: Request): Promise<Response> {
    const access_token = request.headers.get('Authorization')?.replace("Bearer ", "");
    if (!access_token) {
        return new Response(JSON.stringify({ error: "no access or referesh token" }), {
            status: 400
        })
    }
    try {
        let supabase = createServerDbClient(access_token);
        let [formData, profile, documentsData] = await Promise.all([
            request.formData(),
            supabase.from('profile').select('*').single(),
            supabase.from('document').select("metadata")
        ]);


        let { data: userData, error: err } = await supabase.auth.getUser(access_token);
        if (!userData || !userData.user?.id) {
            return new Response(JSON.stringify({ error: err?.message }), {
                status: err?.status
            })
        }

        if (profile.error) {
            return new Response(JSON.stringify({ error: profile.error.message }), {
                status: 400
            })
        }

        if (documentsData.error) {
            return new Response(JSON.stringify({ error: documentsData.error.message }), {
                status: 500
            })
        }

        let size_total = documentsData.data.reduce((a, b) => {
            let metadata = b.metadata as any
            let currentsize = metadata.size as number
            return currentsize + a
        }, 0)

        //size is in byte, convert to mb
        let size_total_in_mb = size_total / 1_048_576;
        if (!hasEnoughStorage(profile.data.tier!, size_total_in_mb)) {
            return new Response(JSON.stringify({ error: "no enough storage space" }), {
                status: 507
            })
        }

        const files = formData.getAll('file') as File[];
        // assert one files at a time 
        let file = files[0];
        let { data, error } = await supabase.storage
            .from('documents')
            .upload(`${userData!.user?.id}/${file.name}`, file, {
                upsert: false
            })

        if (data) {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ error: error!.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e }), {
            status: 400
        })
    }

}


export function createServerDbClient(accessToken: string) {
    return createClient<Database>(supabaseUrl, aenoKey, {
        db: {
            schema: 'public',
        },
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        },
    });
}

function hasEnoughStorage(tier: number, size_total_in_mb: number): boolean {

    if (tier == 0) {
        return size_total_in_mb < parseInt(free_user_storage_limit!)
    }

    if (tier == 1) {
        return size_total_in_mb < parseInt(pro_user_strorage_limit!)
    }
    return false
}
