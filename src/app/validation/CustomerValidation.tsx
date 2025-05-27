'use client'
import z from 'zod';

export const CustomerSchema = z.object({
    name: z.string().min(2).max(50),
    password: z.string().min(6).refine((val) => {
        const alpha = (val.match(/[a-zA-Z]/g) || []).length;
        const numeric = (val.match(/[0-9]/g) || []).length;
        const special = (val.match(/[^a-zA-Z0-9]/g) || []).length;
        return alpha >= 4 && numeric >= 2 && special >= 1;
    }, {
        message: "Password must contain at least 4 letters, 2 numbers, and 1 special character."
    }),
    address: z.string().min(5,'Address is required.'),
    city: z.string().min(2,'City is required.'),
    state: z.string().min(2,'State is required.'),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/,"Invalid postal code format. Use 12345 or 12345-6789."),
    email: z.string().email('Imvalid email format.'),
    phone: z.string().regex(/^(1-)?\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/,'Invalid phone number format. Use 123-456-7890'),
    comments: z.string().optional()
});

export type CustomerType = z.infer<typeof CustomerSchema>;