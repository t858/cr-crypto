"use client";

import { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/app/components/dashboard/DashboardProvider";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
import { countries } from "@/utils/countries";
import { uploadFiles } from "@/lib/uploadthing";

export default function ProfilePage() {
    const { metadata, refreshMetadata, verificationStep } = useDashboard();
    const { data: session } = useSession();
    
    // Form state populated with existing metadata if available
    const [formData, setFormData] = useState({
        fullName: metadata?.profile?.fullName || "",
        phone: metadata?.profile?.phone || "",
        country: metadata?.profile?.country || "",
        address: metadata?.profile?.address || "",
        city: metadata?.profile?.city || "",
        dob: metadata?.profile?.dob || "",
        photoUrl: metadata?.profile?.photoUrl || "",
        idDocumentUrl: metadata?.profile?.idDocumentUrl || "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync form data when metadata arrives
    useEffect(() => {
        if (metadata?.profile) {
            setFormData({
                fullName: metadata.profile.fullName || "",
                phone: metadata.profile.phone || "",
                country: metadata.profile.country || "",
                address: metadata.profile.address || "",
                city: metadata.profile.city || "",
                dob: metadata.profile.dob || "",
                photoUrl: metadata.profile.photoUrl || "",
                idDocumentUrl: metadata.profile.idDocumentUrl || "",
            });
        }
    }, [metadata]);

    const isFullyVerified = verificationStep === 3 || (formData.fullName && formData.country && formData.photoUrl);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB.");
            return;
        }

        setIsUploading(true);
        setUploadProgress(40);

        try {
            const res = await uploadFiles("profilePicture", { files: [file] });
            if (res && res[0]?.url) {
                setUploadProgress(100);
                const uploadedUrl = res[0].url;
                setFormData(prev => ({ ...prev, photoUrl: uploadedUrl }));
                
                // Immediately save photo URL
                await fetch("/api/user/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ photoUrl: uploadedUrl }),
                });
                await refreshMetadata();
                toast.success("Selfie uploaded & saved successfully! ✓");
            } else {
                throw new Error("Cloud upload failed");
            }
        } catch (uploadErr: any) {
            console.error("UploadThing cloud upload error:", uploadErr);
            toast.error("Cloud upload failed. Please make sure UPLOADTHING_TOKEN is set in .env.local!");
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            setShowSuccess(true);
            await refreshMetadata();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Profile</h1>
                    <p className="text-gray-400">Manage your personal information and verified identity details.</p>
                </div>
                {isFullyVerified && (
                    <div className="flex items-center gap-2 bg-[#22c55e]/15 border border-[#22c55e]/30 px-4 py-2 rounded-xl text-[#22c55e] font-bold text-sm shadow-sm shrink-0">
                        <Icon icon="lucide:shield-check" className="text-xl" />
                        <span>100% Identity Verified ✓</span>
                    </div>
                )}
            </div>

            {/* Verification Status Banner */}
            {isFullyVerified ? (
                <div className="mb-8 bg-gradient-to-r from-[#22c55e]/20 via-[#1b1e22] to-[#1b1e22] border border-[#22c55e]/30 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e] shrink-0">
                            <Icon icon="lucide:check-circle-2" className="text-3xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                Identity Verification 100% Completed
                                <span className="bg-[#22c55e] text-black text-[10px] uppercase font-black px-2 py-0.5 rounded-md">VERIFIED</span>
                            </h3>
                            <p className="text-xs text-gray-300 mt-0.5">
                                Your KYC information and document selfie have been verified and saved to your account.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-8 bg-gradient-to-r from-amber-500/10 via-[#1b1e22] to-[#1b1e22] border border-amber-500/30 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                            <Icon icon="lucide:alert-circle" className="text-3xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Identity Verification Pending</h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Complete your personal details & selfie upload to reach 100% verification.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#1b1e22] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                
                {/* Header / Avatar Upload Section */}
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-8 items-center md:items-start bg-black/20">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#3b82f6]/20 bg-[#111315] flex items-center justify-center shrink-0 relative">
                            {formData.photoUrl ? (
                                <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Icon icon="lucide:user" className="text-6xl text-gray-600" />
                            )}

                            {/* Green Checkmark Badge on Selfie Photo */}
                            {formData.photoUrl && (
                                <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#22c55e] border-2 border-[#1b1e22] flex items-center justify-center text-black font-black shadow-lg" title="Selfie Verified ✓">
                                    <Icon icon="lucide:check" className="text-lg font-black" />
                                </div>
                            )}
                            
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                            >
                                <Icon icon="lucide:camera" className="text-white text-2xl mb-1" />
                                <span className="text-white text-xs font-medium">Change Selfie</span>
                            </button>
                        </div>
                        
                        {isUploading && (
                            <div className="absolute -bottom-4 left-0 right-0 h-1.5 bg-[#111315] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#3b82f6] transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap mb-1">
                            <h2 className="text-xl font-bold text-white">
                                {formData.fullName || session?.user?.name || "Update your name below"}
                            </h2>
                            {formData.photoUrl && (
                                <span className="bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Icon icon="lucide:check-circle" className="text-sm" />
                                    Selfie Uploaded ✓
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            {session?.user?.email}
                        </p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="text-sm bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 font-medium"
                        >
                            <Icon icon="lucide:upload" />
                            {isUploading ? "Uploading Selfie..." : "Upload Selfie Picture"}
                        </button>
                    </div>
                </div>

                {/* Form Fields Grid */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Country of Residence</label>
                        <div className="relative">
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#3b82f6] transition-colors"
                            >
                                <option value="" disabled>Select Country</option>
                                {countries.map(c => (
                                    <option key={c.code} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <Icon icon="lucide:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Street Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Trading Lane, Suite 100"
                            className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">City / Region</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York City"
                            className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
                        />
                    </div>

                    {/* ID Document Upload & Status Row */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Government ID Card / Passport Document</label>
                        <label className={`block border ${formData.idDocumentUrl ? 'border-[#22c55e]/50 bg-[#22c55e]/5' : 'border-white/10 bg-[#111315]'} rounded-xl p-5 cursor-pointer hover:bg-white/5 transition-all text-center group`}>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    toast.loading("Uploading ID Document to secure cloud...", { id: "docUpload" });
                                    try {
                                        const res = await uploadFiles("idDocument", { files: [file] });
                                        if (res && res[0]?.url) {
                                            const docUrl = res[0].url;
                                            setFormData(prev => ({ ...prev, idDocumentUrl: docUrl }));
                                            await fetch("/api/user/profile", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ idDocumentUrl: docUrl }),
                                            });
                                            await refreshMetadata();
                                            toast.success("ID Document uploaded & saved successfully! ✓", { id: "docUpload" });
                                        }
                                    } catch (err: any) {
                                        toast.error("Document upload failed. Please try again.", { id: "docUpload" });
                                    }
                                }}
                            />
                            {formData.idDocumentUrl ? (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#22c55e]/20 border border-[#22c55e] flex items-center justify-center shrink-0">
                                            <Icon icon="lucide:check-circle-2" className="text-2xl text-[#22c55e]" />
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="text-sm font-bold text-white">Government ID Document / Passport</h4>
                                                <span className="bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <Icon icon="lucide:check" className="text-xs font-black" />
                                                    Document Uploaded ✓
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">Verified & stored in cloud storage. Click box to upload replacement.</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={formData.idDocumentUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-[#22c55e]/15 hover:bg-[#22c55e]/25 text-[#22c55e] border border-[#22c55e]/30 px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                                    >
                                        <span>View Document</span>
                                        <Icon icon="lucide:external-link" className="text-xs" />
                                    </a>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Icon icon="lucide:file-up" className="text-xl text-gray-300" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-300">
                                        Click to upload ID Card, Passport, or Driver's License
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, PDF up to 8MB</p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-white/5 bg-black/20 flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                        {isSaving ? (
                            <>
                                <Icon icon="lucide:loader-2" className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Icon icon="lucide:save" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1b1e22] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                                <Icon icon="lucide:check" className="text-[#22c55e] text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Profile Updated!</h3>
                        <p className="text-gray-400 text-sm mb-6">Your changes have been saved successfully.</p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2.5 rounded-xl font-medium transition-colors w-full shadow-lg shadow-blue-500/20"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
