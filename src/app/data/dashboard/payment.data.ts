export interface PaymentRefResponse {
    ref_id: string;
    amount: number;
    amount_paid: number | null;
    payment_type: string;
    status: 'Pending' | 'Completed' | 'Failed' | string;
    summary: string;
    email: string;
  }
  