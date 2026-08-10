import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

export async function createServerClient(token?: string) {
    const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const pb = new PocketBase(pocketbaseUrl);

    // Disable auto-cancellation to prevent race conditions during React rendering concurrent cycles
    pb.autoCancellation(false);

    if (token) {
        pb.authStore.save(token, null);
        return pb;
    }

    try {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('pb_auth')?.value || '';
        if (authCookie) {
            pb.authStore.loadFromCookie(authCookie);
        }
    } catch {
        // Fallback for non-request environments
    }

    return pb;
}
