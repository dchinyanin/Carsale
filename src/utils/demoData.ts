import { Car } from '../types';

export const DEMO_CARS: Omit<Car, 'id' | 'createdAt'>[] = [
  {
    name: 'BMW X5 2020',
    year: 2020,
    mileage: 45000,
    price: 4500000,
    downPayment: 1000000,
    loanAmount: 3500000,
    interestRate: 12.5,
    loanTermYears: 5,
    url: 'https://auto.ru/cars/bmw/x5/used/sale/1234567890/',
    imageUrl: 'https://avatars.mds.yandex.net/get-autoru-vos/11353/f0e4c8b7c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9/1200x900',
    monthlyPayment: 78542,
    totalPayment: 4712520,
    totalInterest: 1212520
  },
  {
    name: 'Mercedes-Benz C-Class 2019',
    year: 2019,
    mileage: 32000,
    price: 3200000,
    downPayment: 800000,
    loanAmount: 2400000,
    interestRate: 11.8,
    loanTermYears: 4,
    url: 'https://auto.ru/cars/mercedes/c_klasse/used/sale/0987654321/',
    imageUrl: 'https://avatars.mds.yandex.net/get-autoru-vos/11353/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0/1200x900',
    monthlyPayment: 61234,
    totalPayment: 2939232,
    totalInterest: 539232
  },
  {
    name: 'Audi A4 2021',
    year: 2021,
    mileage: 15000,
    price: 3800000,
    downPayment: 1200000,
    loanAmount: 2600000,
    interestRate: 13.2,
    loanTermYears: 6,
    url: 'https://auto.ru/cars/audi/a4/used/sale/5678901234/',
    imageUrl: 'https://avatars.mds.yandex.net/get-autoru-vos/11353/z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0/1200x900',
    monthlyPayment: 52847,
    totalPayment: 3804984,
    totalInterest: 1204984
  }
];

export const addDemoData = (addCarFunction: (car: Omit<Car, 'id' | 'createdAt'>) => void) => {
  DEMO_CARS.forEach(car => addCarFunction(car));
};

export const DEMO_LOAN_SCENARIOS = [
  {
    name: 'Экономный вариант',
    interestRate: 9.5,
    loanTermYears: 3,
    downPaymentPercent: 30
  },
  {
    name: 'Стандартный вариант',
    interestRate: 12.0,
    loanTermYears: 5,
    downPaymentPercent: 20
  },
  {
    name: 'Длительный вариант',
    interestRate: 15.0,
    loanTermYears: 7,
    downPaymentPercent: 10
  }
];