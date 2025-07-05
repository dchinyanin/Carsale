import React, { useState, useEffect } from 'react';
import './App.css';

interface Car {
  id: number;
  name: string;
  url: string;
  year: number;
  mileage: number;
  price: number;
  initialPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  monthlyPayment: number;
  totalPayment: number;
  overpayment: number;
  image?: string;
  addedDate: string;
}

interface EarlyPayment {
  amount: number;
  type: 'reduce-term' | 'reduce-payment';
  newMonthlyPayment?: number;
  newTermMonths?: number;
  totalSavings?: number;
}

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isCalculatingEarly, setIsCalculatingEarly] = useState(false);
  const [earlyPaymentAmount, setEarlyPaymentAmount] = useState<number>(0);
  const [earlyPaymentType, setEarlyPaymentType] = useState<'reduce-term' | 'reduce-payment'>('reduce-term');
  const [earlyPaymentResult, setEarlyPaymentResult] = useState<EarlyPayment | null>(null);

  // Форма добавления авто
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    initialPayment: 0,
    interestRate: 12,
    loanTermYears: 5
  });

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedCars = localStorage.getItem('carCalculatorData');
    if (savedCars) {
      setCars(JSON.parse(savedCars));
    }
  }, []);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('carCalculatorData', JSON.stringify(cars));
  }, [cars]);

  // Расчет кредита
  const calculateLoan = (price: number, initialPayment: number, interestRate: number, termYears: number) => {
    const loanAmount = price - initialPayment;
    const monthlyRate = interestRate / 100 / 12;
    const termMonths = termYears * 12;
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    const totalPayment = monthlyPayment * termMonths + initialPayment;
    const overpayment = totalPayment - price;

    return {
      loanAmount,
      monthlyPayment,
      totalPayment,
      overpayment
    };
  };

  // Расчет досрочного погашения
  const calculateEarlyPayment = (car: Car, earlyAmount: number, type: 'reduce-term' | 'reduce-payment') => {
    const remainingBalance = car.loanAmount;
    const monthlyRate = car.interestRate / 100 / 12;
    const termMonths = car.loanTermYears * 12;
    
    const newLoanAmount = remainingBalance - earlyAmount;
    
    if (type === 'reduce-term') {
      // Уменьшение срока кредита
      const newTermMonths = Math.ceil(Math.log(1 + (newLoanAmount * monthlyRate) / car.monthlyPayment) / Math.log(1 + monthlyRate));
      const totalSavings = (termMonths - newTermMonths) * car.monthlyPayment;
      
      return {
        amount: earlyAmount,
        type,
        newTermMonths,
        totalSavings
      };
    } else {
      // Уменьшение ежемесячного платежа
      const newMonthlyPayment = newLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                               (Math.pow(1 + monthlyRate, termMonths) - 1);
      const totalSavings = (car.monthlyPayment - newMonthlyPayment) * termMonths;
      
      return {
        amount: earlyAmount,
        type,
        newMonthlyPayment,
        totalSavings
      };
    }
  };

  // Попытка парсинга данных по ссылке
  const parseCarData = async (url: string) => {
    try {
      // Простая попытка извлечь данные из URL
      if (url.includes('auto.ru') || url.includes('avito.ru')) {
        // Здесь можно добавить более сложную логику парсинга
        // Пока что оставляем заглушку
        return {
          name: 'Автомобиль из объявления',
          image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        };
      }
    } catch (error) {
      console.error('Ошибка парсинга:', error);
    }
    return null;
  };

  // Добавление автомобиля
  const handleAddCar = async () => {
    if (!formData.name || !formData.price) {
      alert('Заполните обязательные поля!');
      return;
    }

    const loanData = calculateLoan(
      formData.price,
      formData.initialPayment,
      formData.interestRate,
      formData.loanTermYears
    );

    // Попытка парсинга данных
    const parsedData = await parseCarData(formData.url);

    const newCar: Car = {
      id: Date.now(),
      name: formData.name,
      url: formData.url,
      year: formData.year,
      mileage: formData.mileage,
      price: formData.price,
      initialPayment: formData.initialPayment,
      interestRate: formData.interestRate,
      loanTermYears: formData.loanTermYears,
      ...loanData,
      image: parsedData?.image,
      addedDate: new Date().toLocaleDateString('ru-RU')
    };

    setCars([...cars, newCar]);
    setIsAddingCar(false);
    setFormData({
      name: '',
      url: '',
      year: new Date().getFullYear(),
      mileage: 0,
      price: 0,
      initialPayment: 0,
      interestRate: 12,
      loanTermYears: 5
    });
  };

  // Удаление автомобиля
  const handleDeleteCar = (id: number) => {
    setCars(cars.filter(car => car.id !== id));
  };

  // Расчет досрочного погашения
  const handleEarlyPaymentCalculation = () => {
    if (!selectedCar || !earlyPaymentAmount) return;

    const result = calculateEarlyPayment(selectedCar, earlyPaymentAmount, earlyPaymentType);
    setEarlyPaymentResult(result);
  };

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1 className="logo">🚗 Помощник покупки авто</h1>
          <p className="subtitle">Расчет кредита и сравнение вариантов</p>
        </div>
      </header>

      <main className="main">
        {!isAddingCar ? (
          <>
            <div className="container">
              <div className="top-section">
                <button 
                  className="btn btn-primary add-car-btn"
                  onClick={() => setIsAddingCar(true)}
                >
                  + Добавить авто
                </button>
                <div className="stats">
                  <div className="stat-item">
                    <span className="stat-number">{cars.length}</span>
                    <span className="stat-label">Вариантов авто</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {cars.length > 0 ? formatCurrency(Math.min(...cars.map(car => car.monthlyPayment))) : '0 ₽'}
                    </span>
                    <span className="stat-label">Мин. платеж</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {cars.length > 0 ? formatCurrency(Math.min(...cars.map(car => car.overpayment))) : '0 ₽'}
                    </span>
                    <span className="stat-label">Мин. переплата</span>
                  </div>
                </div>
              </div>

              {cars.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🚗</div>
                  <h2>Добавьте первый автомобиль</h2>
                  <p>Начните сравнивать варианты и рассчитывать кредит</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsAddingCar(true)}
                  >
                    Добавить авто
                  </button>
                </div>
              ) : (
                <div className="cars-grid">
                  {cars.map(car => (
                    <div key={car.id} className="car-card">
                      {car.image && (
                        <img src={car.image} alt={car.name} className="car-image" />
                      )}
                      <div className="car-header">
                        <h3>{car.name}</h3>
                        <span className="car-year">{car.year} год</span>
                      </div>
                      
                      <div className="car-details">
                        <div className="detail-row">
                          <span>Цена:</span>
                          <span className="price">{formatCurrency(car.price)}</span>
                        </div>
                        <div className="detail-row">
                          <span>Пробег:</span>
                          <span>{car.mileage.toLocaleString()} км</span>
                        </div>
                        <div className="detail-row">
                          <span>Первый взнос:</span>
                          <span>{formatCurrency(car.initialPayment)}</span>
                        </div>
                        <div className="detail-row">
                          <span>Сумма кредита:</span>
                          <span>{formatCurrency(car.loanAmount)}</span>
                        </div>
                        <div className="detail-row">
                          <span>Ставка:</span>
                          <span>{car.interestRate}% годовых</span>
                        </div>
                        <div className="detail-row">
                          <span>Срок:</span>
                          <span>{car.loanTermYears} лет</span>
                        </div>
                      </div>

                      <div className="loan-summary">
                        <div className="summary-item main">
                          <span>Ежемесячный платеж:</span>
                          <span className="monthly-payment">{formatCurrency(car.monthlyPayment)}</span>
                        </div>
                        <div className="summary-item">
                          <span>Общая сумма:</span>
                          <span>{formatCurrency(car.totalPayment)}</span>
                        </div>
                        <div className="summary-item">
                          <span>Переплата:</span>
                          <span className="overpayment">{formatCurrency(car.overpayment)}</span>
                        </div>
                      </div>

                      <div className="car-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => {
                            setSelectedCar(car);
                            setIsCalculatingEarly(true);
                          }}
                        >
                          Досрочное погашение
                        </button>
                        {car.url && (
                          <a 
                            href={car.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-link"
                          >
                            Посмотреть объявление
                          </a>
                        )}
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteCar(car.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="container">
            <div className="add-car-form">
              <h2>Добавить автомобиль</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Название автомобиля *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="BMW X5 2020"
                  />
                </div>

                <div className="form-group">
                  <label>Ссылка на объявление</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://auto.ru/cars/used/sale/..."
                  />
                </div>

                <div className="form-group">
                  <label>Год выпуска</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    min="1990"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="form-group">
                  <label>Пробег (км)</label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Цена автомобиля *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                    min="0"
                    placeholder="2500000"
                  />
                </div>

                <div className="form-group">
                  <label>Первоначальный взнос</label>
                  <input
                    type="number"
                    value={formData.initialPayment}
                    onChange={(e) => setFormData({...formData, initialPayment: parseInt(e.target.value)})}
                    min="0"
                    placeholder="500000"
                  />
                </div>

                <div className="form-group">
                  <label>Процентная ставка (%)</label>
                  <input
                    type="number"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({...formData, interestRate: parseFloat(e.target.value)})}
                    step="0.1"
                    min="0"
                    max="30"
                  />
                </div>

                <div className="form-group">
                  <label>Срок кредита (лет)</label>
                  <input
                    type="number"
                    value={formData.loanTermYears}
                    onChange={(e) => setFormData({...formData, loanTermYears: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleAddCar}
                >
                  Добавить автомобиль
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsAddingCar(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно досрочного погашения */}
        {isCalculatingEarly && selectedCar && (
          <div className="modal" onClick={() => setIsCalculatingEarly(false)}>
            <div className="modal-content early-payment-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                className="close-button"
                onClick={() => setIsCalculatingEarly(false)}
              >
                ×
              </button>
              
              <h2>Досрочное погашение</h2>
              <p className="modal-subtitle">{selectedCar.name}</p>

              <div className="early-payment-form">
                <div className="form-group">
                  <label>Сумма досрочного погашения</label>
                  <input
                    type="number"
                    value={earlyPaymentAmount}
                    onChange={(e) => setEarlyPaymentAmount(parseInt(e.target.value))}
                    placeholder="100000"
                  />
                </div>

                <div className="form-group">
                  <label>Тип погашения</label>
                  <select 
                    value={earlyPaymentType}
                    onChange={(e) => setEarlyPaymentType(e.target.value as 'reduce-term' | 'reduce-payment')}
                  >
                    <option value="reduce-term">Уменьшение срока кредита</option>
                    <option value="reduce-payment">Уменьшение ежемесячного платежа</option>
                  </select>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={handleEarlyPaymentCalculation}
                >
                  Рассчитать
                </button>
              </div>

              {earlyPaymentResult && (
                <div className="early-payment-result">
                  <h3>Результат расчета:</h3>
                  <div className="result-grid">
                    <div className="result-item">
                      <span>Сумма погашения:</span>
                      <span>{formatCurrency(earlyPaymentResult.amount)}</span>
                    </div>
                    {earlyPaymentResult.newMonthlyPayment && (
                      <div className="result-item">
                        <span>Новый ежемесячный платеж:</span>
                        <span className="highlight">{formatCurrency(earlyPaymentResult.newMonthlyPayment)}</span>
                      </div>
                    )}
                    {earlyPaymentResult.newTermMonths && (
                      <div className="result-item">
                        <span>Новый срок кредита:</span>
                        <span className="highlight">{earlyPaymentResult.newTermMonths} месяцев</span>
                      </div>
                    )}
                    {earlyPaymentResult.totalSavings && (
                      <div className="result-item">
                        <span>Общая экономия:</span>
                        <span className="savings">{formatCurrency(earlyPaymentResult.totalSavings)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;