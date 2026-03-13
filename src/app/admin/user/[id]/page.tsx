import AdminUserEditor from "./AdminUserEditor";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="w-full">
            <AdminUserEditor userId={id} />
        </div>
    );
}
