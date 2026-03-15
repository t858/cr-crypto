"use client";

import { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/app/components/dashboard/DashboardProvider";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { countries } from "@/utils/countries";

export default function ProfilePage() {
    const { metadata, refreshMetadata } = useDashboard();
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
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Sync form data when metadata arrives from Supabase (async fetch)
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
            });
        }
    }, [metadata]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Ensure it's an image
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload a valid image file.");
            return;
        }

        // Limit size to 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB.");
            return;
        }

        setIsUploading(true);
        setUploadProgress(20); // Pseudo-progress

        try {
            const fileExtension = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
            
            setUploadProgress(40);
            
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;
            setUploadProgress(80);

            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(data.path);

            setFormData(prev => ({ ...prev, photoUrl: publicUrlData.publicUrl }));
            toast.success("Profile picture uploaded to Supabase!");
            setUploadProgress(100);
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image. Please try again.");
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
            // Refresh global dashboard context to reflect new name/image in sidebars
            await refreshMetadata();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl max-w-content mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400">Manage your personal information and configuration.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#1b1e22] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                
                {/* Header / Avatar Upload Section */}
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-8 items-center md:items-start bg-black/20">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#3b82f6]/20 bg-[#111315] flex items-center justify-center shrink-0">
                            {formData.photoUrl ? (
                                <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Icon icon="lucide:user" className="text-6xl text-gray-600" />
                            )}
                            
                            {/* Upload Overlay */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Icon icon="lucide:camera" className="text-white text-2xl mb-1" />
                                <span className="text-white text-xs font-medium">Change</span>
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
                        <h2 className="text-xl font-bold text-white mb-1">
                            {formData.fullName || "Update your name below"}
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">
                            PNG or JPG. Minimum recommendation 256x256px.
                        </p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="text-sm bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                            <Icon icon="lucide:upload" />
                            {isUploading ? "Uploading..." : "Upload New Picture"}
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
