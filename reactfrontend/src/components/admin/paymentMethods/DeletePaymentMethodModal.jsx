import React from 'react';
import Modal from '../../common/Modal';
import { Trash2 } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import paymentMethodService from '../../../services/paymentMethodService';

const DeletePaymentMethodModal = ({ paymentMethodId, onDeleted, ...modalProps }) => {
    const { addToast } = useToast();

    const handleDelete = async () => {
        try {
            await paymentMethodService.delete(paymentMethodId);
            addToast('Payment method deleted', 'success');
            onDeleted?.();
            modalProps.onClose();
        } catch (err) {
            console.error(err);
            addToast('Error deleting payment method', 'error');
        }
    };

    return (
        <Modal {...modalProps} title="Delete payment method?">
            <div className="flex items-center gap-3">
                <Trash2 className="text-red-600 shrink-0" />
                <p>This action can’t be undone.</p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <button onClick={modalProps.onClose} className="px-4 py-2 rounded-md">
                    Cancel
                </button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md">
                    Delete
                </button>
            </div>
        </Modal>
    );
};

export default DeletePaymentMethodModal;
