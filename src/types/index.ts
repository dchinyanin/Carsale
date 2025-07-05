export interface Car {
  id: string;
  url?: string;
  name: string;
  year: number;
  mileage: number;
  price: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  imageUrl?: string;
  monthlyPayment?: number;
  totalPayment?: number;
  totalInterest?: number;
  createdAt: Date;
}

export interface LoanCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  payments: PaymentSchedule[];
}

export interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface EarlyPaymentCalculation {
  type: 'reduce_term' | 'reduce_payment';
  amount: number;
  newMonthlyPayment?: number;
  newTermMonths?: number;
  savedInterest: number;
  savedTime?: number;
}