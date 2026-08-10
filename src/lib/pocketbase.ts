import PocketBase from 'pocketbase';

const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pocketbaseUrl);

// Disable auto cancellation to prevent concurrent React rendering cycles from aborting requests
pb.autoCancellation(false);

// Automatically sync token changes to document cookies on client side
if (typeof window !== 'undefined') {
    pb.authStore.onChange((token, model) => {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    });
}

export function syncPocketBaseToken(token?: string, record?: any) {
    if (!token) return;
    if (pb.authStore.token !== token) {
        pb.authStore.save(token, record || null);
        if (typeof window !== 'undefined') {
            document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
        }
    }
}
