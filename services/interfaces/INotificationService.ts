/**
 * Notification Service Interface
 * 
 * Abstracts UI notifications to allow swapping implementations (e.g. react-hot-toast, sonner, native alerts).
 * 
 * @module services/interfaces/INotificationService
 */

export interface INotificationService {
    success(message: string): void;
    error(message: string): void;
    loading(message: string): string; // returns toast ID
    dismiss(id: string): void;
}
