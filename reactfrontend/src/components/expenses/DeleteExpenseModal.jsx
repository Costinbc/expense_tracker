import React from "react";
import { Trash2 } from "lucide-react";
import Modal from "../common/Modal";
import expenseService from "../../services/expenseService";
import { useToast } from "../../contexts/ToastContext";

const DeleteExpenseModal = ({ expenseId, onDeleted, ...modalProps }) => {
    const { addToast } = useToast();

    const handleDelete = async () => {
        try {
            await expenseService.delete(expenseId);
            addToast("Expense deleted", "success");
            onDeleted?.();
            modalProps.onClose?.();
        } catch (err) {
            console.error(err);
            addToast("Error deleting expense", "error");
        }
    };

    return (
        <Modal {...modalProps} title="Confirm delete">
            <div className="flex items-center gap-4">
                <Trash2 className="text-red-600" />
                <p>Are you sure you want to delete this expense?</p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <button className="px-4 py-2 rounded-md" onClick={modalProps.onClose}>
                    Cancel
                </button>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};

export default DeleteExpenseModal;
