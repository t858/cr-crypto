import fs from "fs";
import path from "path";

// Define the shape of our user
export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash?: string;
    createdAt: string;
}

// Path to our mock database file
const dbPath = path.join(process.cwd(), "data", "users.json");

// Ensure the data directory and users.json file exist
const initDB = () => {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]), "utf-8");
    }
};

// Read all users from the file
export const getUsers = (): User[] => {
    initDB();
    try {
        const data = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading users database:", error);
        return [];
    }
};

// Find a user by email
export const getUserByEmail = (email: string): User | undefined => {
    const users = getUsers();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

// Add a new user to the file
export const addUser = (user: Omit<User, "id" | "createdAt">): User => {
    const users = getUsers();
    
    // Check if user already exists
    if (getUserByEmail(user.email)) {
        throw new Error("User already exists");
    }

    const newUser: User = {
        ...user,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), "utf-8");
    
    return newUser;
};
