"use server";

import { getUsers, saveUsers, updateUser } from "@/lib/jsonbin";

export interface AnnouncementNotification {
    id: string;
    title: string;
    message: string;
    type?: "info" | "warning" | "success" | "alert";
    createdAt: string;
    read?: boolean;
    isGlobal?: boolean;
}

export async function getUserForAdmin(userId: string) {
    const users = await getUsers();
    return users.find((u: any) => u.id === userId);
}

export async function saveUserMetadata(userId: string, metadata: any) {
    return await updateUser(userId, { metadata });
}

export async function sendAnnouncementAction({
    targetUserId,
    title,
    message,
    type = "info",
}: {
    targetUserId: string; // "GLOBAL" or a specific userId
    title: string;
    message: string;
    type?: "info" | "warning" | "success" | "alert";
}) {
    const users = await getUsers();

    if (!users || users.length === 0) {
        return { success: false, error: "No user database connected" };
    }

    const newNotification: AnnouncementNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title,
        message,
        type,
        createdAt: new Date().toISOString(),
        read: false,
        isGlobal: targetUserId === "GLOBAL",
    };

    if (targetUserId === "GLOBAL") {
        const updatedUsers = users.map((user: any) => {
            const currentMeta = user.metadata || {};
            const notifications = Array.isArray(currentMeta.notifications) ? currentMeta.notifications : [];
            return {
                ...user,
                metadata: {
                    ...currentMeta,
                    notifications: [newNotification, ...notifications],
                },
            };
        });

        const saved = await saveUsers(updatedUsers);
        return { success: saved, count: updatedUsers.length };
    } else {
        const userIndex = users.findIndex((u: any) => u.id === targetUserId);
        if (userIndex === -1) {
            return { success: false, error: "Target user not found" };
        }

        const user = users[userIndex];
        const currentMeta = user.metadata || {};
        const notifications = Array.isArray(currentMeta.notifications) ? currentMeta.notifications : [];

        user.metadata = {
            ...currentMeta,
            notifications: [newNotification, ...notifications],
        };

        users[userIndex] = user;
        const saved = await saveUsers(users);
        return { success: saved };
    }
}

export async function markNotificationsAsReadAction(userId: string) {
    const users = await getUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return false;

    const user = users[userIndex];
    if (!user.metadata || !Array.isArray(user.metadata.notifications)) return true;

    user.metadata.notifications = user.metadata.notifications.map((n: AnnouncementNotification) => ({
        ...n,
        read: true,
    }));

    users[userIndex] = user;
    return await saveUsers(users);
}

export async function deleteNotificationAction(userId: string, notificationId: string) {
    const users = await getUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return false;

    const user = users[userIndex];
    if (!user.metadata || !Array.isArray(user.metadata.notifications)) return true;

    user.metadata.notifications = user.metadata.notifications.filter((n: AnnouncementNotification) => n.id !== notificationId);

    users[userIndex] = user;
    return await saveUsers(users);
}

