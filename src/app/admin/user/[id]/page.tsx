import AdminUserEditor from "./AdminUserEditor";

export default function EditUserPage({ params }: { params: { id: string } }) {
    return (
        <div className="w-full">
            <AdminUserEditor userId={params.id} />
        </div>
    );
}
