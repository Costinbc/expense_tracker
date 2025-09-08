import React, { useEffect, useState } from "react";
import userProfileService from "../../services/userProfileService";
import { useToast } from "../../contexts/ToastContext";

const UserProfile = () => {
    const { addToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const p = await userProfileService.get();
            setProfile(p);
        };
        fetchProfile();
    }, []);

    const handleChange = (e) =>
        setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userProfileService.update(profile);
            if (avatarFile) {
                await userProfileService.uploadAvatar(avatarFile);
            }
            addToast("Profile updated", "success");
        } catch (err) {
            console.error(err);
            addToast("Error updating profile", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <p>Loading...</p>;

    return (
        <form className="max-w-xl mx-auto space-y-4" onSubmit={handleSave}>
            <div className="flex flex-col items-center gap-4">
                {profile.avatarUrl && (
                    <img
                        src={profile.avatarUrl}
                        alt="avatar"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 bg-gray-100"
                    disabled
                />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save"}
            </button>
        </form>
    );
};

export default UserProfile;