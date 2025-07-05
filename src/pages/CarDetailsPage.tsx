import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { calculateEarlyPayment, formatCurrency, formatNumber } from '../utils/loanCalculator';

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCar, deleteCar } = useCarContext();
  
  const [earlyPaymentAmount, setEarlyPaymentAmount] = useState(0);
  const [earlyPaymentType, setEarlyPaymentType] = useState<'reduce_term' | 'reduce_payment'>('reduce_term');
  
  const car = id ? getCar(id) : undefined;

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Автомобиль не найден</h1>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      deleteCar(car.id);
      navigate('/');
    }
  };

  const remainingMonths = car.loanTermYears * 12;
  const earlyPaymentCalc = earlyPaymentAmount > 0 ? 
    calculateEarlyPayment(
      car.loanAmount,
      car.monthlyPayment || 0,
      car.interestRate,
      remainingMonths,
      earlyPaymentAmount,
      earlyPaymentType
    ) : null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Назад к списку
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
            <p className="text-gray-600 mt-1">Детальная информация и расчеты</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Изображение и основные данные */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {car.imageUrl && (
              <div className="aspect-video bg-gray-100">
                <img 
                  src={car.imageUrl} 
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Год</div>
                  <div className="font-semibold">{car.year}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Пробег</div>
                  <div className="font-semibold">{formatNumber(car.mileage)} км</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Цена</div>
                  <div className="font-semibold">{formatCurrency(car.price)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Ставка</div>
                  <div className="font-semibold">{car.interestRate}%</div>
                </div>
              </div>

              {car.url && (
                <div className="mt-4">
                  <a
                    href={car.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    → Посмотреть объявление
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Калькулятор досрочного погашения */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Калькулятор досрочного погашения
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сумма досрочного погашения (₽)
                </label>
                <input
                  type="number"
                  value={earlyPaymentAmount}
                  onChange={(e) => setEarlyPaymentAmount(Number(e.target.value))}
                  min="0"
                  max={car.loanAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите сумму"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Способ применения
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="earlyPaymentType"
                      value="reduce_term"
                      checked={earlyPaymentType === 'reduce_term'}
                      onChange={(e) => setEarlyPaymentType(e.target.value as 'reduce_term' | 'reduce_payment')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Сократить срок</div>
                      <div className="text-sm text-gray-600">Платеж остается тот же</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="earlyPaymentType"
                      value="reduce_payment"
                      checked={earlyPaymentType === 'reduce_payment'}
                      onChange={(e) => setEarlyPaymentType(e.target.value as 'reduce_term' | 'reduce_payment')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Уменьшить платеж</div>
                      <div className="text-sm text-gray-600">Срок остается тот же</div>
                    </div>
                  </label>
                </div>
              </div>
              
              {earlyPaymentCalc && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-3">Результат досрочного погашения</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {earlyPaymentType === 'reduce_term' ? (
                      <>
                        <div>
                          <div className="text-sm text-green-700">Новый срок</div>
                          <div className="font-semibold text-green-900">
                            {earlyPaymentCalc.newTermMonths} мес
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-green-700">Экономия времени</div>
                          <div className="font-semibold text-green-900">
                            {earlyPaymentCalc.savedTime} мес
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="text-sm text-green-700">Новый платеж</div>
                          <div className="font-semibold text-green-900">
                            {formatCurrency(earlyPaymentCalc.newMonthlyPayment || 0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-green-700">Экономия в месяц</div>
                          <div className="font-semibold text-green-900">
                            {formatCurrency((car.monthlyPayment || 0) - (earlyPaymentCalc.newMonthlyPayment || 0))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div>
                      <div className="text-sm text-green-700">Экономия по процентам</div>
                      <div className="font-semibold text-green-900">
                        {formatCurrency(earlyPaymentCalc.savedInterest)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Финансовая сводка */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Условия кредита
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Стоимость авто:</span>
                <span className="font-semibold">{formatCurrency(car.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Первоначальный взнос:</span>
                <span className="font-semibold">{formatCurrency(car.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Сумма кредита:</span>
                <span className="font-semibold">{formatCurrency(car.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Процентная ставка:</span>
                <span className="font-semibold">{car.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Срок кредита:</span>
                <span className="font-semibold">{car.loanTermYears} лет</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Расчеты
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Ежемесячный платеж:</span>
                <span className="font-semibold text-lg text-blue-600">
                  {formatCurrency(car.monthlyPayment || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Общая сумма выплат:</span>
                <span className="font-semibold">{formatCurrency(car.totalPayment || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Переплата по процентам:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(car.totalInterest || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Количество платежей:</span>
                <span className="font-semibold">{car.loanTermYears * 12} мес</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;