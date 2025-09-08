import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/common/Table';
import SearchInput from '../components/common/SearchInput';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import IncomeForm from '../components/incomes/IncomeForm';
import DeleteIncomeModal from '../components/incomes/DeleteIncomeModal';
import incomeService from '../services/incomeService';
import { useToast } from '../contexts/ToastContext';

const IncomesPage = () => {
    const [incomes, setIncomes] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ open: false, mode: '', income: null });
    const { addToast } = useToast();


    const fetchIncomes = async () => {
        setLoading(true);
        try {
            const { page, pageSize } = pagination;
            const resp = await incomeService.getPage(page, pageSize, searchQuery);
            const pageData = resp.response.data;
            console.log(pageData);
            setIncomes(pageData);
            setPagination((prev) => ({ ...prev, total: pageData.totalCount }));
        } catch (err) {
            console.error(err);
            addToast('Failed to load incomes', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, [pagination.page, pagination.pageSize, searchQuery]);


    const openAdd = () => setModal({ open: true, mode: 'add', income: null });
    const openEdit = (inc) => setModal({ open: true, mode: 'edit', income: inc });
    const openDelete = (inc) => setModal({ open: true, mode: 'delete', income: inc });
    const closeModal = () => setModal({ open: false, mode: '', income: null });

    const handleSave = async (data) => {
        try {
            if (modal.mode === 'add') {
                await incomeService.add(data);
                addToast('Income added', 'success');
            } else {
                await incomeService.update({ ...data, id: modal.income.id });
                addToast('Income updated', 'success');
            }
            fetchIncomes();
            closeModal();
        } catch (err) {
            console.error(err);
            addToast('Error saving income', 'error');
        }
    };


    const columns = [
        { header: 'Date', accessor: 'date', render: (i) => new Date(i.date).toLocaleDateString() },
        { header: 'Amount', accessor: 'amount', render: (i) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(i.amount) },
        { header: 'Description', accessor: 'description' },
        { header: 'Category', accessor: 'categoryName', render: (i) => i.categoryName || '-' },
        { header: 'Payment Method', accessor: 'paymentMethodName', render: (i) => i.paymentMethodName || '-' },
        {
            header: 'Actions',
            render: (i) => (
                <div className="flex gap-2">
                    <button onClick={() => openEdit(i)} className="text-primary-600 hover:underline">
                        Edit
                    </button>
                    <button onClick={() => openDelete(i)} className="text-red-600 hover:underline">
                        Delete
                    </button>
                </div>
            )
        }
    ];


    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl mb-8 p-8 text-white shadow-lg transform hover:scale-[1.01] transition">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Manage Incomes</h1>
                        <p className="text-primary-100">View, add, edit or delete your incomes</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <SearchInput onSearch={(q) => { setSearchQuery(q); setPagination((p) => ({ ...p, page: 1 })); }} placeholder="Search incomes…" />
                    <button onClick={openAdd} className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow">
                        <Plus className="w-5 h-5 mr-2" /> Add Income
                    </button>
                </div>

                <Table columns={columns} data={incomes} />

                <div className="mt-4">
                    <Pagination
                        currentPage={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
                        onPageSizeChange={(s) => setPagination((prev) => ({ ...prev, pageSize: s, page: 1 }))}
                    />
                </div>
            </div>

            {modal.open && modal.mode !== 'delete' && (
                <Modal isOpen onClose={closeModal} title={modal.mode === 'add' ? 'Add Income' : 'Edit Income'}>
                    <IncomeForm income={modal.mode === 'edit' ? modal.income : undefined} onSuccess={handleSave} onClose={closeModal} />
                </Modal>
            )}

            {modal.open && modal.mode === 'delete' && (
                <DeleteIncomeModal isOpen incomeId={modal.income.id} onDeleted={fetchIncomes} onClose={closeModal} />
            )}
        </div>
    );
};

export default IncomesPage;
