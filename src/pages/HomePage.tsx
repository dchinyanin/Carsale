import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { Plus, Car, Calendar, Gauge, DollarSign, CreditCard, ArrowUpDown } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/loanCalculator';
import CarComparison from '../components/CarComparison';
import { addDemoData } from '../utils/demoData';

const HomePage: React.FC = () => {
  const { cars, addCar } = useCarContext();
  const [showComparison, setShowComparison] = useState(false);

  const handleLoadDemoData = () => {
    if (window.confirm('Загрузить демонстрационные автомобили? Это добавит 3 примера автомобилей с расчетами.')) {
      addDemoData(addCar);
    }
  };

  if (cars.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Добро пожаловать в CarLoan!
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Начните добавлять автомобили, которые вас интересуют, и сравнивайте 
            условия кредитования для принятия лучшего решения.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/add-car"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Добавить первый автомобиль
            </Link>
            <button
              onClick={handleLoadDemoData}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Car className="h-5 w-5 mr-2" />
              Загрузить примеры
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мои автомобили</h1>
          <p className="text-gray-600 mt-1">
            Сравните условия кредитования и выберите лучший вариант
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {cars.length > 1 && (
            <button
              onClick={() => setShowComparison(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowUpDown className="h-5 w-5 mr-2" />
              Сравнить
            </button>
          )}
          <Link
            to="/add-car"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Добавить авто
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Link
            key={car.id}
            to={`/car/${car.id}`}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
          >
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {car.name}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{car.year} год</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Gauge className="h-4 w-4 mr-2" />
                  <span>{formatNumber(car.mileage)} км</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{formatCurrency(car.price)}</span>
                </div>
              </div>

              {car.monthlyPayment && (
                <div className="bg-primary-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-primary-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {formatCurrency(car.monthlyPayment)}/мес
                    </span>
                  </div>
                  <div className="text-xs text-primary-600 mt-1">
                    {car.interestRate}% на {car.loanTermYears} лет
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {cars.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Всего автомобилей: {cars.length}
          </p>
        </div>
      )}
      
      <CarComparison 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
      />
    </div>
  );
};

export default HomePage;