import React, { useState } from 'react';
import { useCarContext } from '../context/CarContext';
import { formatCurrency, formatNumber } from '../utils/loanCalculator';
import { Car, X, ArrowUpDown, Calendar, Gauge, DollarSign, CreditCard, Percent } from 'lucide-react';

interface CarComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const CarComparison: React.FC<CarComparisonProps> = ({ isOpen, onClose }) => {
  const { cars } = useCarContext();
  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleCarSelect = (carId: string) => {
    setSelectedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : prev.length < 3 ? [...prev, carId] : prev
    );
  };

  const comparisonCars = cars.filter(car => selectedCars.includes(car.id));

  const getBestValue = (cars: any[], field: string, isLower: boolean = true) => {
    if (cars.length === 0) return null;
    const values = cars.map(car => car[field]).filter(val => val !== undefined);
    if (values.length === 0) return null;
    return isLower ? Math.min(...values) : Math.max(...values);
  };

  const getBestCar = (cars: any[], field: string, isLower: boolean = true) => {
    const bestValue = getBestValue(cars, field, isLower);
    return cars.find(car => car[field] === bestValue);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ArrowUpDown className="h-6 w-6 mr-2" />
            Сравнение автомобилей
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {selectedCars.length === 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Выберите автомобили для сравнения (до 3 штук)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cars.map(car => (
                  <div
                    key={car.id}
                    onClick={() => handleCarSelect(car.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedCars.includes(car.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{car.name}</h4>
                      {selectedCars.includes(car.id) && (
                        <div className="text-primary-600 text-sm font-medium">
                          Выбран
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {car.year} • {formatCurrency(car.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Сравнение {selectedCars.length} автомобилей
                </h3>
                <button
                  onClick={() => setSelectedCars([])}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Очистить выбор
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-gray-900">Параметр</th>
                      {comparisonCars.map(car => (
                        <th key={car.id} className="text-left p-4 font-medium text-gray-900">
                          {car.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Изображения */}
                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700">Фото</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          {car.imageUrl ? (
                            <img 
                              src={car.imageUrl} 
                              alt={car.name}
                              className="w-32 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Car className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Основные параметры */}
                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700">Год выпуска</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className={`flex items-center ${
                            getBestCar(comparisonCars, 'year', false)?.id === car.id 
                              ? 'text-green-600 font-semibold' 
                              : 'text-gray-900'
                          }`}>
                            <Calendar className="h-4 w-4 mr-2" />
                            {car.year}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700">Пробег</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className={`flex items-center ${
                            getBestCar(comparisonCars, 'mileage', true)?.id === car.id 
                              ? 'text-green-600 font-semibold' 
                              : 'text-gray-900'
                          }`}>
                            <Gauge className="h-4 w-4 mr-2" />
                            {formatNumber(car.mileage)} км
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700">Цена</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className={`flex items-center ${
                            getBestCar(comparisonCars, 'price', true)?.id === car.id 
                              ? 'text-green-600 font-semibold' 
                              : 'text-gray-900'
                          }`}>
                            <DollarSign className="h-4 w-4 mr-2" />
                            {formatCurrency(car.price)}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700">Первоначальный взнос</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className="text-gray-900">
                            {formatCurrency(car.downPayment)}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700">Процентная ставка</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className={`flex items-center ${
                            getBestCar(comparisonCars, 'interestRate', true)?.id === car.id 
                              ? 'text-green-600 font-semibold' 
                              : 'text-gray-900'
                          }`}>
                            <Percent className="h-4 w-4 mr-2" />
                            {car.interestRate}%
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-700">Срок кредита</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className="text-gray-900">
                            {car.loanTermYears} лет
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Расчеты */}
                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-700">Ежемесячный платеж</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className={`flex items-center ${
                            getBestCar(comparisonCars, 'monthlyPayment', true)?.id === car.id 
                              ? 'text-green-600 font-semibold' 
                              : 'text-gray-900'
                          }`}>
                            <CreditCard className="h-4 w-4 mr-2" />
                            {formatCurrency(car.monthlyPayment || 0)}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-700">Общая сумма выплат</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className={`${
                            getBestCar(comparisonCars, 'totalPayment', true)?.id === car.id 
                              ? 'text-green-600 font-semibold' 
                              : 'text-gray-900'
                          }`}>
                            {formatCurrency(car.totalPayment || 0)}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-700">Переплата</td>
                      {comparisonCars.map(car => (
                        <td key={car.id} className="p-4">
                          <div className={`${
                            getBestCar(comparisonCars, 'totalInterest', true)?.id === car.id 
                              ? 'text-green-600 font-semibold' 
                              : 'text-red-600'
                          }`}>
                            {formatCurrency(car.totalInterest || 0)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Пояснение к сравнению</h4>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold text-green-600">Зеленым</span> выделены лучшие показатели в каждой категории. 
                  Учитывайте все параметры комплексно для принятия решения.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedCars.length > 0 && (
              <>Выбрано: {selectedCars.length} из {cars.length} автомобилей</>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedCars([])}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Очистить
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarComparison;