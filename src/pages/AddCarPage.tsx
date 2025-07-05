import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { calculateLoan } from '../utils/loanCalculator';
import { parseAutoRuUrl, isValidCarUrl } from '../utils/autoParser';

const AddCarPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCar } = useCarContext();
  
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    downPayment: 0,
    interestRate: 12,
    loanTermYears: 5,
    imageUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsingUrl, setIsParsingUrl] = useState(false);

  const handleUrlParse = async () => {
    if (!formData.url || !isValidCarUrl(formData.url)) {
      alert('Пожалуйста, введите корректную ссылку на Auto.ru, Avito или Drom');
      return;
    }

    setIsParsingUrl(true);
    try {
      const parsedData = await parseAutoRuUrl(formData.url);
      if (parsedData) {
        setFormData(prev => ({
          ...prev,
          name: parsedData.name || prev.name,
          year: parsedData.year || prev.year,
          price: parsedData.price || prev.price,
          mileage: parsedData.mileage || prev.mileage,
          imageUrl: parsedData.imageUrl || prev.imageUrl,
        }));
        alert('Данные успешно извлечены из URL!');
      } else {
        alert('Не удалось извлечь данные из URL. Попробуйте заполнить форму вручную.');
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
      alert('Ошибка при извлечении данных. Заполните форму вручную.');
    } finally {
      setIsParsingUrl(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'url' || name === 'name' || name === 'imageUrl' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const loanAmount = formData.price - formData.downPayment;
      const loanCalculation = calculateLoan(loanAmount, formData.interestRate, formData.loanTermYears);

      const newCar = {
        ...formData,
        loanAmount,
        monthlyPayment: loanCalculation.monthlyPayment,
        totalPayment: loanCalculation.totalPayment,
        totalInterest: loanCalculation.totalInterest,
      };

      addCar(newCar);
      navigate('/');
    } catch (error) {
      console.error('Error adding car:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loanAmount = formData.price - formData.downPayment;
  const monthlyPayment = loanAmount > 0 ? calculateLoan(loanAmount, formData.interestRate, formData.loanTermYears).monthlyPayment : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Назад к списку
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Добавить автомобиль</h1>
        <p className="text-gray-600 mt-1">
          Заполните информацию об автомобиле и условиях кредитования
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основная информация */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            🚗 Основная информация
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка на объявление
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://auto.ru/cars/used/sale/..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUrlParse}
                  disabled={!formData.url || isParsingUrl}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isParsingUrl ? '⏳ Загрузка...' : '📥 Загрузить'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Поддерживаются ссылки с Auto.ru, Avito и Drom
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название автомобиля *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="BMW X5 2020"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Год выпуска *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="1950"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пробег (км) *
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка на изображение
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Финансовые условия */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            💰 Финансовые условия
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Стоимость автомобиля (₽) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Первоначальный взнос (₽) *
              </label>
              <input
                type="number"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleInputChange}
                required
                min="0"
                max={formData.price}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Процентная ставка (%) *
              </label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                required
                min="0"
                max="50"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="12.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок кредита (лет) *
              </label>
              <input
                type="number"
                name="loanTermYears"
                value={formData.loanTermYears}
                onChange={handleInputChange}
                required
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
              />
            </div>
          </div>

          {/* Предварительный расчет */}
          {formData.price > 0 && formData.downPayment >= 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Предварительный расчет</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Сумма кредита:</span>
                  <div className="font-semibold text-blue-900">
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(loanAmount)}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700">Ежемесячный платеж:</span>
                  <div className="font-semibold text-blue-900">
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(monthlyPayment)}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700">Общая сумма:</span>
                  <div className="font-semibold text-blue-900">
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(monthlyPayment * formData.loanTermYears * 12)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Отменить
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить автомобиль'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCarPage;