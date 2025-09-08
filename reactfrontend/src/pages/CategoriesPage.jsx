import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/common/Table';
import SearchInput from '../components/common/SearchInput';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import CategoryForm from '../components/admin/categories/CategoryForm';
import DeleteCategoryModal from '../components/admin/categories/DeleteCategoryModal';
import categoryService from '../services/categoryService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const CategoriesPage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ open: false, mode: '', category: null });
    const [saving, setSaving] = useState(false);

    const { addToast } = useToast();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { page, pageSize } = pagination;
            const resp = await categoryService.getPage(page, pageSize, searchQuery);
            const pageData = resp?.data?.response ?? resp?.response ?? {};
            setCategories(pageData.data);
            setPagination(prev => ({ ...prev, total: pageData.totalCount }));
        } catch (err) {
            console.error(err);
            addToast('Failed to load categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, [pagination.page, pagination.pageSize, searchQuery]);

    const openAdd = () => setModal({ open: true, mode: 'add', category: null });
    const openEdit = c => setModal({ open: true, mode: 'edit', category: c });
    const openDelete = c => setModal({ open: true, mode: 'delete', category: c });
    const closeModal = () => setModal({ open: false, mode: '', category: null });

    const handleSave = async data => {
        if (saving) return;
        setSaving(true);
        try {
            if (modal.mode === 'add') {
                await categoryService.add(data);
                addToast('Category added', 'success');
            } else {
                await categoryService.update({ id: modal.category.id, ...data });
                addToast('Category updated', 'success');
            }
            fetchCategories();
            closeModal();
        } catch (err) {
            console.error(err);
            addToast('Error saving category', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await categoryService.delete(modal.category.id);
            addToast('Category deleted', 'success');
            fetchCategories();
            closeModal();
        } catch (err) {
            console.error(err);
            addToast('Error deleting category', 'error');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        {
            header: 'Actions',
            render: c => (
                <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-primary-600 hover:underline">Edit</button>
                    <button onClick={() => openDelete(c)} className="text-red-600 hover:underline">Delete</button>
                </div>
            )
        }
    ];

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">403 – Forbidden</h1>
                    <p className="text-gray-600">You must be an admin to manage categories.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl mb-8 p-8 text-white shadow-lg transform hover:scale-[1.01] transition">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Manage Categories</h1>
                        <p className="text-primary-100">Create, edit or delete categories</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <SearchInput
                        placeholder="Search categories..."
                        onSearch={q => { setSearchQuery(q); setPagination(p => ({ ...p, page: 1 })); }}
                    />
                    <button onClick={openAdd} className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow">
                        <Plus className="w-5 h-5 mr-2" /> Add Category
                    </button>
                </div>

                <Table columns={columns} data={categories} isLoading={loading} emptyMessage="No categories found" />

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
                <Modal isOpen onClose={closeModal} title={modal.mode === 'add' ? 'Add Category' : 'Edit Category'} isLoading={saving}>
                    <CategoryForm
                        category={modal.mode === 'edit' ? modal.category : undefined}
                        onSuccess={handleSave}
                        onClose={closeModal}
                    />
                </Modal>
            )}

            {modal.open && modal.mode === 'delete' && (
                <DeleteCategoryModal
                    isOpen
                    categoryId={modal.category.id}
                    onDeleted={fetchCategories}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default CategoriesPage;