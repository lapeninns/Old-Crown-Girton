import { useState, useCallback } from 'react';

export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: string;
    message: string;
}

export interface UseBookingFormProps {
    onSuccess?: () => void;
    successMessage?: string;
}

export function useBookingForm({ onSuccess, successMessage }: UseBookingFormProps = {}) {
    const [formData, setFormData] = useState<BookingFormData>({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        try {
            // In production, integrate with booking system here
            // await submitBooking(formData);

            const message = successMessage || 'Thank you! We will call you within 1 hour to confirm your booking.';
            alert(message);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Booking submission failed:', error);
            alert('Something went wrong. Please try again or call us correctly.');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, onSuccess, successMessage]);

    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            guests: '2',
            message: ''
        });
    }, []);

    return {
        formData,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm
    };
}
