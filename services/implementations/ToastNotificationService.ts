/**
 * Toast Notification Service Implementation
 * 
 * Uses react-hot-toast.
 * 
 * @module services/implementations/ToastNotificationService
 */

import { toast } from 'react-hot-toast';
import type { INotificationService } from '../interfaces/INotificationService';

export class ToastNotificationService implements INotificationService {
    success(message: string): void {
        toast.success(message);
    }

    error(message: string): void {
        toast.error(message);
    }

    loading(message: string): string {
        return toast.loading(message);
    }

    dismiss(id: string): void {
        toast.dismiss(id);
    }
}

export const notificationService = new ToastNotificationService();
