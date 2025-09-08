import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import userProfileService from '../services/userProfileService';


const ProfilePage = () => {
    const { user } = useAuth();
    const { addToast } = useToast();

    const [profile, setProfile] = useState(null);   // null ⇒ doesn’t exist yet
    const [form, setForm] = useState({ bio: '', phoneNumber: '', address: '', birthDate: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const unwrap = (resp) => {
        if (!resp) return null;
        if (resp.data?.result) return resp.data.result;
        if (resp.data?.data) return resp.data.data;
        if (resp.result) return resp.result;
        return resp;
    };

    useEffect(() => {
        (async () => {
            try {
                const raw = await userProfileService.get();
                const dto = unwrap(raw);
                setProfile(dto);
                setForm({
                    bio: dto.bio ?? '',
                    phoneNumber: dto.phoneNumber ?? '',
                    address: dto.address ?? '',
                    birthDate: dto.birthDate ? dto.birthDate.split('T')[0] : ''
                });
                setEditing(false);
            } catch (err) {
                if (err?.response?.status === 404) {
                    setProfile(null);
                    setEditing(false);
                } else {
                    console.error(err);
                    addToast('Failed to load profile', 'error');
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [addToast]);

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async e => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            if (profile === null) {
                await userProfileService.add({ ...form, userId: user.id });
                addToast('Profile created', 'success');
            } else {
                await userProfileService.update({ id: profile.id, ...form });
                addToast('Profile updated', 'success');
            }
            // reload fresh profile
            const raw = await userProfileService.get();
            setProfile(unwrap(raw));
            setEditing(false);
        } catch (err) {
            console.error(err);
            addToast('Error saving profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-center py-20">Loading profile…</p>;

    const gradient = 'bg-gradient-to-r from-primary-600 to-primary-800';
    const isExisting = profile !== null;
    const pageTitle = isExisting ? 'Your Profile' : 'Create Your Profile';

    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className={`${gradient} rounded-2xl mb-8 p-8 text-white shadow-lg`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">{pageTitle}</h1>
                        <p className="text-primary-100">Personal details &amp; settings</p>
                    </div>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
                        >
                            <Pencil className="w-4 h-4" /> {isExisting ? 'Edit' : 'Create'}
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 max-w-3xl mx-auto">
                {editing ? (
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input value={user?.name || ''} disabled className="w-full border rounded-md p-2 bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input value={user?.email || ''} disabled className="w-full border rounded-md p-2 bg-gray-100" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full border rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Birth Date</label>
                                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="w-full border rounded-md p-2" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea name="address" value={form.address} onChange={handleChange} className="w-full border rounded-md p-2" rows={2} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Bio</label>
                            <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded-md p-2" rows={3} />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setEditing(false)} className="bg-gray-200 rounded-md px-4 py-2">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="bg-primary-600 text-white rounded-md px-4 py-2 disabled:opacity-50">
                                {saving ? 'Saving…' : (isExisting ? 'Save' : 'Create')}
                            </button>
                        </div>
                    </form>
                ) : isExisting ? (
                    <div className="space-y-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold">{user?.name}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                            <p className="text-gray-500">Role: {user?.role}</p>
                        </div>

                        {profile?.bio && (
                            <section>
                                <h3 className="text-lg font-medium mb-1">About</h3>
                                <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                            </section>
                        )}

                        <section className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-sm mb-1">Phone</h4>
                                <p className="text-gray-700">{profile?.phoneNumber || '—'}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm mb-1">Birth Date</h4>
                                <p className="text-gray-700">{profile?.birthDate ? new Date(profile.birthDate).toLocaleDateString() : '—'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="font-medium text-sm mb-1">Address</h4>
                                <p className="text-gray-700">{profile?.address || '—'}</p>
                            </div>
                        </section>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No profile yet. Click “Create” to add your details.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
