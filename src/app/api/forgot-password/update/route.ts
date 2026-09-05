import { POST as resetPasswordHandler } from "@/app/api/auth/reset-password/route";

export async function POST(req: Request) {
    return resetPasswordHandler(req);
}
