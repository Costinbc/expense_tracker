import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/common/Table';
import SearchInput from '../components/common/SearchInput';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import PaymentMethodForm from '../components/admin/paymentMethods/PaymentMethodForm';
import DeletePaymentMethodModal from '../components/admin/paymentMethods/DeletePaymentMethodModal';
import paymentMethodService from '../services/paymentMethodService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const PaymentMethodsPage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const [methods, setMethods] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ open: false, mode: '', method: null });
    const [saving, setSaving] = useState(false);

    const { addToast } = useToast();

    const fetchMethods = async () => {
        setLoading(true);
        try {
            const { page, pageSize } = pagination;
            const resp = await paymentMethodService.getPage(page, pageSize, searchQuery);
            setMethods(resp.response.data || []);
            setPagination(prev => ({ ...prev, total: resp.response.totalCount }));
        } catch (err) {
            console.error(err);
            addToast('Failed to load payment methods', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, [pagination.page, pagination.pageSize, searchQuery]);

    const openAdd = () => setModal({ open: true, mode: 'add', method: null });
    const openEdit = m => setModal({ open: true, mode: 'edit', method: m });
    const openDelete = m => setModal({ open: true, mode: 'delete', method: m });
    const closeModal = () => setModal({ open: false, mode: '', method: null });

    const handleSave = async (data) => {
        if (saving) return; // prevent duplicate submissions
        setSaving(true);
        try {
            if (modal.mode === 'add') {
                await paymentMethodService.add(data);
                addToast('Payment method added', 'success');
            } else {
                await paymentMethodService.update({ ...data, id: modal.method.id });
                addToast('Payment method updated', 'success');
            }
            fetchMethods();
            closeModal();
        } catch (err) {
            console.error(err);
            addToast('Error saving payment method', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await paymentMethodService.delete(modal.method.id);
            addToast('Payment method deleted', 'success');
            fetchMethods();
            closeModal();
        } catch (err) {
            console.error(err);
            addToast('Error deleting payment method', 'error');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Actions', render: m => (
                <div className="flex gap-2">
                    <button onClick={() => openEdit(m)} className="text-primary-600 hover:underline">Edit</button>
                    <button onClick={() => openDelete(m)} className="text-red-600 hover:underline">Delete</button>
                </div>
            )}
    ];

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">403 – Forbidden</h1>
                    <p className="text-gray-600">You must be an admin to manage payment methods.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl mb-8 p-8 text-white shadow-lg transform hover:scale-[1.01] transition">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Manage Payment Methods</h1>
                        <p className="text-primary-100">Create, edit or delete how you pay</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <SearchInput
                        placeholder="Search payment methods..."
                        onSearch={q => { setSearchQuery(q); setPagination(p => ({ ...p, page: 1 })); }}
                    />
                    <button onClick={openAdd} className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow">
                        <Plus className="w-5 h-5 mr-2" /> Add Payment Method
                    </button>
                </div>

                <Table columns={columns} data={methods} isLoading={loading} emptyMessage="No payment methods found" />

                <div className="mt-4">
                    <Pagination
                        currentPage={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onPageChange={p => setPagination(prev => ({ ...prev, page: p }))}
                        onPageSizeChange={s => setPagination(prev => ({ ...prev, pageSize: s, page: 1 }))}
                    />
                </div>
            </div>

            {modal.open && modal.mode !== 'delete' && (
                <Modal isOpen onClose={closeModal} title={modal.mode === 'add' ? 'Add Payment Method' : 'Edit Payment Method'} confirmText="Save" cancelText="Cancel" isLoading={saving} onConfirm={() => { /* noop: handled in form */ }}>
                    <PaymentMethodForm
                        paymentMethod={modal.mode === 'edit' ? modal.method : undefined}
                        onSuccess={handleSave}
                        onClose={closeModal}
                    />
                </Modal>
            )}

            {modal.open && modal.mode === 'delete' && (
                <DeletePaymentMethodModal
                    isOpen
                    paymentMethodId={modal.method.id}
                    onDeleted={fetchMethods}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default PaymentMethodsPage;