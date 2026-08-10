export function getJsonBinConfig() {
    let apiKey = (process.env.JSONBIN_API_KEY || "").trim();
    let binId = (process.env.JSONBIN_BIN_ID || "").trim();

    apiKey = apiKey.replace(/^['"]|['"]$/g, "").replace(/\\/g, "").trim();
    binId = binId.replace(/^['"]|['"]$/g, "").replace(/\\/g, "").trim();

    // Fallback if Next.js .env loader truncated dollar sign interpolation
    if (!apiKey || !apiKey.startsWith("$2a$10$")) {
        apiKey = "$2a$10$suA2R1NTVop/Ymsi6ZC.ieK1mJdWRV8G.J1CpUrg4ndgJpeMSC/dC";
    }
    if (!binId) {
        binId = "6a6c474fda38895dfea77299";
    }

    return {
        apiKey,
        binId,
        baseUrl: binId ? `https://api.jsonbin.io/v3/b/${binId}` : "",
    };
}

export async function getUsers(): Promise<any[]> {
    const { apiKey, binId, baseUrl } = getJsonBinConfig();

    if (!apiKey || !binId || !baseUrl) {
        return [];
    }

    try {
        const response = await fetch(baseUrl, {
            method: "GET",
            headers: {
                "X-Master-Key": apiKey,
                "X-Bin-Meta": "false",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("[JSONBIN] getUsers failed:", response.status, await response.text());
            return [];
        }

        const data = await response.json();
        let users: any[] = [];
        if (Array.isArray(data)) users = data;
        else if (Array.isArray(data.record)) users = data.record;
        else if (Array.isArray(data.users)) users = data.users;

        return users;
    } catch (err) {
        console.error("[JSONBIN] getUsers exception:", err);
        return [];
    }
}

export async function saveUsers(users: any[]) {
    const { apiKey, binId, baseUrl } = getJsonBinConfig();

    if (!apiKey || !binId || !baseUrl) {
        return false;
    }

    try {
        const response = await fetch(baseUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": apiKey,
            },
            cache: "no-store",
            body: JSON.stringify(users),
        });

        if (!response.ok) {
            console.error("[JSONBIN] saveUsers failed:", response.status, await response.text());
            return false;
        }

        return true;
    } catch (err) {
        console.error("[JSONBIN] saveUsers exception:", err);
        return false;
    }
}

export async function getUserByIdOrEmail(identifier: string) {
    if (!identifier) return null;
    const users = await getUsers();
    const cleanId = identifier.trim().toLowerCase();

    return users.find(
        (u: any) =>
            u.id === identifier ||
            (u.email && u.email.toLowerCase() === cleanId)
    ) || null;
}

export async function updateUser(identifier: string, updateData: any) {
    const users = await getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const index = users.findIndex(
        (u: any) =>
            u.id === identifier ||
            (u.email && u.email.toLowerCase() === cleanId)
    );
    
    if (index === -1) return null;

    users[index] = { ...users[index], ...updateData };
    const saved = await saveUsers(users);
    
    return saved ? users[index] : null;
}

