import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import feedbackService from '../services/feedbackService';


const FeedbackPage = () => {
    const { addToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        category: 'General',
        experienceRating: 'Good',
        wouldRecommend: false,
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        if (!form.comment.trim()) {
            addToast('Please enter a comment', 'error');
            return;
        }

        setSaving(true);
        try {
            await feedbackService.add({
                category: form.category,
                experienceRating: form.experienceRating,
                wouldRecommend: form.wouldRecommend,
                comment: form.comment.trim()
            });
            addToast('Thank you for your feedback!', 'success');
            setForm({ category: 'General', experienceRating: 'Good', wouldRecommend: false, comment: '' });
        } catch (err) {
            console.error(err);
            addToast('Error submitting feedback', 'error');
        } finally {
            setSaving(false);
        }
    };

    const gradient = 'bg-gradient-to-r from-primary-600 to-primary-800';

    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className={`${gradient} rounded-2xl mb-8 p-8 text-white shadow-lg`}>
                <h1 className="text-3xl font-bold">We value your feedback</h1>
                <p className="text-primary-100 mt-1">Help us improve CosTracker</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                        >
                            <option value="General">General</option>
                            <option value="Bug Report">Bug Report</option>
                            <option value="Feature Request">Feature Request</option>
                        </select>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Overall experience</p>
                        <div className="flex items-center gap-4">
                            {['Poor', 'Average', 'Good', 'Excellent'].map((val) => (
                                <label key={val} className="flex items-center gap-1 text-sm">
                                    <input
                                        type="radio"
                                        name="experienceRating"
                                        value={val}
                                        checked={form.experienceRating === val}
                                        onChange={handleChange}
                                        className="accent-primary-600"
                                    />
                                    {val}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="wouldRecommend"
                            name="wouldRecommend"
                            checked={form.wouldRecommend}
                            onChange={handleChange}
                            className="accent-primary-600"
                        />
                        <label htmlFor="wouldRecommend" className="text-sm">I would recommend this app to others</label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="comment">Comments</label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={form.comment}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                            rows={4}
                            placeholder="Share your thoughts…"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary-600 text-white rounded-md px-4 py-2 disabled:opacity-50"
                    >
                        {saving ? 'Submitting…' : 'Submit feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;
