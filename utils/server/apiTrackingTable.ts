/*
Why we need this class?
the initial thoughts was using redis for caching, but it turns out that
all redis clients needs a node js to be it's runtime
but our api endpoints and middlewares are all running on edge runtime. Hence we have no access
to redis client. So we have to use this class to cache the api calls.
this is a temporary solution, we will move to redis once we are actually running on multiple servers
*/
export class ApiTrackingTable {
    private map: Map<string, { value: any, expiry: number }>;
    private defaultTtl = 3600; // 1 hour in seconds

    constructor() {
        this.map = new Map();
    }

    // put a key-value pair into the map with an expiry time in milliseconds
    public put(key: string, value: any, ttl?: number) {
        if (this.map.has(key) && ttl === undefined) {
            // Update the value, but keep the original expiry
            const originalEntry = this.map.get(key)!;
            this.map.set(key, { value, expiry: originalEntry.expiry });
        } else {
            // If ttl is not provided, use the default
            const expiry = Date.now() + ((ttl ?? this.defaultTtl) * 1000);
            this.map.set(key, { value, expiry });
        }
    }

    // get the value associated with a key, if the key has not expired
    public get(key: string) {
        if (!this.map.has(key)) return null;

        const { value, expiry } = this.map.get(key)!;
        if (expiry > Date.now()) {
            return value;
        } else {
            // remove the expired key
            this.map.delete(key);
            return null;
        }
    }

    public incr(key: string): number {
        if (!this.map.has(key)) {
            this.put(key, 1);
            return 1;
        }

        const entry = this.map.get(key)!;
        if (typeof entry.value !== 'number') {
            throw new Error('Cannot increment non-number value');
        }

        entry.value += 1;
        return entry.value;
    }

    public expire(key: string, ttl: number) {
        if (!this.map.has(key)) {
            return;
        }

        const entry = this.map.get(key)!;
        entry.expiry = Date.now() + ttl * 1000;
    }


    // remove a key from the map
    public evict(key: string) {
        this.map.delete(key);
    }
}
