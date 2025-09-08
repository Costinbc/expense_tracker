import React, { useEffect, useState } from 'react';
import paymentMethodService from '../../../services/paymentMethodService';
import SearchInput from '../../common/SearchInput';
import Pagination from '../../common/Pagination';
import Modal from '../../common/Modal';
import PaymentMethodForm from './PaymentMethodForm';
import DeletePaymentMethodModal from './DeletePaymentMethodModal';
import { Plus } from 'lucide-react';
import Table from '../../common/Table';
import { useToast } from '../../../contexts/ToastContext';


const PaymentMethodsTable = () => {
    const { addToast } = useToast();

    const [methods, setMethods] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [modal, setModal] = useState({ open: false, mode: '', method: null });


    const fetchData = async () => {
        setLoading(true);
        try {
            const { page, pageSize } = pagination;
            const res = await paymentMethodService.getPage(page, pageSize, search);
            const { data = [], totalCount = 0 } = res.response;
            setMethods(data);
            setPagination((p) => ({ ...p, total: totalCount }));
        } catch (err) {
            console.error(err);
            addToast('Failed to load payment methods', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.page, pagination.pageSize, search]);


    const openAdd = () => setModal({ open: true, mode: 'add', method: null });
    const openEdit = (m) => setModal({ open: true, mode: 'edit', method: m });
    const openDelete = (m) => setModal({ open: true, mode: 'delete', method: m });
    const closeModal = () => setModal({ open: false, mode: '', method: null });


    const handleSave = async (data) => {
        try {
            if (modal.mode === 'add') {
                await paymentMethodService.add(data);
                addToast('Payment method added', 'success');
            } else {
                await paymentMethodService.update({ ...data, id: modal.method.id });
                addToast('Payment method updated', 'success');
            }
            fetchData();
            closeModal();
        } catch (err) {
            console.error(err);
            addToast('Error saving payment method', 'error');
        }
    };


    const columns = [
        { header: 'Name', accessor: 'name' },
        {
            header: 'Actions',
            render: (m) => (
                <div className="flex gap-2">
                    <button className="text-primary-600 hover:underline" onClick={() => openEdit(m)}>
                        Edit
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => openDelete(m)}>
                        Delete
                    </button>
                </div>
            )
        }
    ];


    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <SearchInput
                    placeholder="Search payment methods..."
                    onSearch={(q) => {
                        setSearch(q);
                        setPagination((p) => ({ ...p, page: 1 }));
                    }}
                />
                <button
                    onClick={openAdd}
                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Payment Method
                </button>
            </div>

            <Table
                columns={columns}
                data={methods}
                isLoading={loading}
                emptyMessage={search ? 'No payment methods match your search.' : 'No payment methods yet.'}
            />

            <Pagination
                currentPage={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
                onPageSizeChange={(s) => setPagination((prev) => ({ ...prev, pageSize: s, page: 1 }))}
            />

            {modal.open && modal.mode !== 'delete' && (
                <Modal isOpen onClose={closeModal} title={modal.mode === 'add' ? 'Add Payment Method' : 'Edit Payment Method'}>
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
                    onDeleted={fetchData}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default PaymentMethodsTable;
