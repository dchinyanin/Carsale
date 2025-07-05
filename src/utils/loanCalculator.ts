import { LoanCalculation, PaymentSchedule, EarlyPaymentCalculation } from '../types';

export const calculateLoan = (
  principal: number,
  annualRate: number,
  termYears: number
): LoanCalculation => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  // Расчет ежемесячного платежа по формуле аннуитетного платежа
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - principal;
  
  // Создаем график платежей
  const payments: PaymentSchedule[] = [];
  let remainingBalance = principal;
  
  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;
    
    payments.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance)
    });
  }
  
  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    payments
  };
};

export const calculateEarlyPayment = (
  currentBalance: number,
  monthlyPayment: number,
  annualRate: number,
  remainingMonths: number,
  earlyPaymentAmount: number,
  type: 'reduce_term' | 'reduce_payment'
): EarlyPaymentCalculation => {
  const monthlyRate = annualRate / 100 / 12;
  const newBalance = currentBalance - earlyPaymentAmount;
  
  if (type === 'reduce_term') {
    // Уменьшаем срок кредита, платеж остается тем же
    const newTermMonths = Math.ceil(
      -Math.log(1 - (newBalance * monthlyRate) / monthlyPayment) / 
      Math.log(1 + monthlyRate)
    );
    
    const originalTotalPayment = monthlyPayment * remainingMonths;
    const newTotalPayment = monthlyPayment * newTermMonths;
    const savedInterest = originalTotalPayment - newTotalPayment - earlyPaymentAmount;
    const savedTime = remainingMonths - newTermMonths;
    
    return {
      type,
      amount: earlyPaymentAmount,
      newTermMonths,
      savedInterest,
      savedTime
    };
  } else {
    // Уменьшаем размер платежа, срок остается тем же
    const newMonthlyPayment = newBalance * 
      (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
      (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    
    const originalTotalPayment = monthlyPayment * remainingMonths;
    const newTotalPayment = newMonthlyPayment * remainingMonths;
    const savedInterest = originalTotalPayment - newTotalPayment - earlyPaymentAmount;
    
    return {
      type,
      amount: earlyPaymentAmount,
      newMonthlyPayment,
      savedInterest
    };
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('ru-RU').format(number);
};