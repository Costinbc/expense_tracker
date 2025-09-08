import React, { useState, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';

const CategoryForm = ({ category, onSuccess, onClose }) => {
    const isEdit = Boolean(category);
    const { addToast } = useToast();
    const [form, setForm] = useState({
        name: category?.name || '',
        type: category?.type || 'Expense'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setForm({ name: category.name, type: category.type });
        }
    }, [category]);

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            await onSuccess(form);
        } catch (err) {
            console.error(err);
            addToast('Error saving category', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                </select>
            </div>

            <div className="flex gap-2 mt-6">
                <button
                    type="submit"
                    className="bg-primary-600 text-white py-2 rounded-md disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save Changes' : 'Add Category')}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-secondary-500 text-white py-2 rounded-md"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
