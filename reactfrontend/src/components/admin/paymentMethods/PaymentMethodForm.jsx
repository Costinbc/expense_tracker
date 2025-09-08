import React, { useEffect, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';

const PaymentMethodForm = ({ paymentMethod, onSuccess, onClose }) => {
    const isEdit = Boolean(paymentMethod);
    const { addToast } = useToast();
    const [form, setForm] = useState({ name: paymentMethod?.name || '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (paymentMethod) setForm({ name: paymentMethod.name });
    }, [paymentMethod]);

    const handleChange = e => setForm({ name: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            await onSuccess(form);
        } catch (err) {
            console.error(err);
            addToast('Error saving payment method', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-primary-600 text-white py-2 rounded-md disabled:opacity-50"
                disabled={loading}
            >
                {loading ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save Changes' : 'Add Payment Method')}
            </button>
        </form>
    );
};

export default PaymentMethodForm;
