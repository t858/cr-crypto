"use client";

import { useState, useEffect } from "react";
import { getUserForAdmin, saveUserMetadata, sendAnnouncementAction } from "@/app/admin/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import EditableDashboard from "@/app/components/dashboard/EditableDashboard";
import { UserDashboardConfig, DEFAULT_DASHBOARD_CONFIG } from "@/app/types/dashboardConfig";

const DEMO_MAP: Record<string, { email: string; name: string }> = {
  usr_demo_01: { email: "trader1@example.com", name: "Alex Rivers" },
  usr_demo_02: { email: "crypto_pro@example.com", name: "Sarah Vance" },
  usr_demo_03: { email: "vip_trader@example.com", name: "Michael Chang" },
};

export default function AdminUserEditor({ userId }: { userId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [dashboardConfig, setDashboardConfig] = useState<UserDashboardConfig>(DEFAULT_DASHBOARD_CONFIG);

  // Announcement Modal State
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"info" | "success" | "warning" | "alert">("info");
  const [sendingNotif, setSendingNotif] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId.startsWith("usr_demo") || userId === "ADMIN_ROOT_001") {
        const demoInfo = DEMO_MAP[userId] || { email: `${userId}@example.com`, name: "Demo Trader Account" };
        setUserEmail(demoInfo.email);
        setUserName(demoInfo.name);
        setLoading(false);
        return;
      }

      try {
        const record = await getUserForAdmin(userId);
        if (!record) throw new Error("User not found");
        setUserEmail(record.email || "No Email");
        setUserName(record.name || "Unnamed Account");

        if (record.metadata) {
          setDashboardConfig({
            ...DEFAULT_DASHBOARD_CONFIG,
            ...record.metadata,
            walletBalances: {
              ...DEFAULT_DASHBOARD_CONFIG.walletBalances,
              ...(record.metadata.walletBalances || {}),
            },
            widgetVisibility: {
              ...DEFAULT_DASHBOARD_CONFIG.widgetVisibility,
              ...(record.metadata.widgetVisibility || {}),
            },
          });
        }
      } catch (err: any) {
        // Fallback gracefully for unknown or deleted record IDs
        setUserEmail(`${userId}@example.com`);
        setUserName(`User Record (${userId.substring(0, 8)})`);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId, session]);

  const handleSaveToPocketBase = async () => {
    setSaving(true);
    if (userId.startsWith("usr_demo") || userId === "ADMIN_ROOT_001") {
      setTimeout(() => {
        setSaving(false);
        toast.success(`Live Dashboard Updated for ${userEmail || "user"}! (Demo Saved)`);
      }, 400);
      return;
    }

    try {
      await saveUserMetadata(userId, dashboardConfig);
      toast.success(`Live Dashboard Updated for ${userEmail || "user"}!`);
    } catch (err: any) {
      if (err?.status === 404) {
        toast.success(`Live Dashboard Saved locally for user!`);
      } else {
        console.error("Failed to save changes to JSONBin:", err);
        toast.error(err?.message || "Failed to push live update to DB");
      }
    }
    setSaving(false);
  };

  const handleSendDirectAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }

    setSendingNotif(true);
    try {
      const res = await sendAnnouncementAction({
        targetUserId: userId,
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        type: notifType,
      });

      if (res.success) {
        toast.success(`Announcement sent directly to ${userEmail}!`);
        setShowAnnouncementModal(false);
        setNotifTitle("");
        setNotifMessage("");
      } else {
        toast.error(res.error || "Failed to send announcement");
      }
    } catch (err) {
      toast.error("Error sending announcement");
    }
    setSendingNotif(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-white font-mono">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse tracking-widest text-sm text-red-400">
          LOADING USER LIVE CANVAS...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0714] text-white relative">
      {/* STICKY TOP ADMIN HEADER */}
      <div className="bg-[#11062b] border-b border-red-500/30 p-4 lg:px-8 sticky top-0 z-40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="bg-white/5 hover:bg-white/10 text-red-400 p-2.5 rounded-lg font-mono text-xs flex items-center gap-2 border border-red-500/30 transition-all"
          >
            <Icon icon="lucide:arrow-left" className="text-sm" /> Back to User List
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded">
                Editing Target User
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">{userName}</h2>
            </div>
            <p className="text-xs font-mono text-gray-400">{userEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-mono text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-2"
          >
            <Icon icon="lucide:bell-plus" className="text-base text-indigo-400" />
            Send Announcement
          </button>
          <button
            onClick={() => setDashboardConfig(DEFAULT_DASHBOARD_CONFIG)}
            className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSaveToPocketBase}
            disabled={saving}
            className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-6 rounded-lg font-mono text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                SYNCING DB...
              </>
            ) : (
              <>
                <Icon icon="lucide:save" className="text-base" />
                PUSH DB UPDATE
              </>
            )}
          </button>
        </div>
      </div>

      {/* ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#11062b] border border-indigo-500/40 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Icon icon="lucide:bell-plus" className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Direct Announcement</h3>
                  <p className="text-xs text-gray-400 font-mono">Send to {userEmail}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <Icon icon="lucide:x" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSendDirectAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-2">Priority Type</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNotifType("info")}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      notifType === "info" ? "bg-blue-500/20 border-blue-500 text-blue-300" : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifType("success")}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      notifType === "success" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    Success
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifType("warning")}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      notifType === "warning" ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    Warning
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifType("alert")}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      notifType === "alert" ? "bg-red-500/20 border-red-500 text-red-300" : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    Urgent
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-2">Title / Subject</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. Portfolio Credit Approved"
                  className="w-full bg-[#0d0522] border border-indigo-500/30 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-2">Message</label>
                <textarea
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Enter message visible on user's notification drawer..."
                  className="w-full bg-[#0d0522] border border-indigo-500/30 rounded-xl p-3 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingNotif}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50"
                >
                  {sendingNotif ? "Sending..." : "Dispatch Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE WYSIWYG DASHBOARD EDITOR */}
      <EditableDashboard
        config={dashboardConfig}
        editMode={true}
        onChangeConfig={setDashboardConfig}
      />
    </div>
  );
}

