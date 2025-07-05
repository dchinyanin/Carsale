import React, { useState } from 'react';
import './App.css';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  image: string;
  description: string;
}

const mockCars: Car[] = [
  {
    id: 1,
    brand: "BMW",
    model: "X5",
    year: 2020,
    price: 3500000,
    mileage: 45000,
    fuel: "Бензин",
    transmission: "Автомат",
    color: "Черный",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Отличное состояние, один владелец, все ТО пройдены"
  },
  {
    id: 2,
    brand: "Mercedes",
    model: "E-Class",
    year: 2019,
    price: 2800000,
    mileage: 62000,
    fuel: "Бензин",
    transmission: "Автомат",
    color: "Белый",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Премиум комплектация, кожаный салон, панорамная крыша"
  },
  {
    id: 3,
    brand: "Toyota",
    model: "Camry",
    year: 2021,
    price: 2200000,
    mileage: 28000,
    fuel: "Бензин",
    transmission: "Автомат",
    color: "Серебристый",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Надежная японская машина, экономичная, идеально подходит для города"
  },
  {
    id: 4,
    brand: "Audi",
    model: "A4",
    year: 2018,
    price: 1950000,
    mileage: 85000,
    fuel: "Бензин",
    transmission: "Автомат",
    color: "Синий",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Спортивная подвеска, четыре кольца качества, отличная управляемость"
  },
  {
    id: 5,
    brand: "Honda",
    model: "Civic",
    year: 2022,
    price: 1800000,
    mileage: 15000,
    fuel: "Бензин",
    transmission: "Механика",
    color: "Красный",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Молодежный автомобиль, динамичный дизайн, небольшой расход"
  },
  {
    id: 6,
    brand: "Volkswagen",
    model: "Tiguan",
    year: 2020,
    price: 2400000,
    mileage: 38000,
    fuel: "Бензин",
    transmission: "Автомат",
    color: "Серый",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Семейный кроссовер, просторный салон, высокая посадка"
  }
];

function App() {
  const [cars] = useState<Car[]>(mockCars);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    return matchesSearch && matchesPrice;
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <h1 className="logo">🚗 CarSale</h1>
            <div className="nav-links">
              <a href="#catalog">Каталог</a>
              <a href="#about">О нас</a>
              <a href="#contact">Контакты</a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h2>Найдите автомобиль своей мечты</h2>
              <p>Большой выбор качественных автомобилей с пробегом и новых</p>
              <button className="btn btn-primary">Смотреть каталог</button>
            </div>
          </div>
        </section>

        <section className="filters" id="catalog">
          <div className="container">
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Поиск по марке или модели..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="price-filter">
                <label>Цена от:</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="price-input"
                />
                <label>до:</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="price-input"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="catalog">
          <div className="container">
            <div className="grid grid-cols-3">
              {filteredCars.map(car => (
                <div key={car.id} className="card car-card" onClick={() => setSelectedCar(car)}>
                  <img src={car.image} alt={`${car.brand} ${car.model}`} className="car-image" />
                  <div className="car-info">
                    <h3>{car.brand} {car.model}</h3>
                    <p className="car-year">{car.year} год</p>
                    <div className="car-specs">
                      <span>🛣️ {car.mileage.toLocaleString('ru-RU')} км</span>
                      <span>⛽ {car.fuel}</span>
                      <span>⚙️ {car.transmission}</span>
                    </div>
                    <div className="car-price">{formatPrice(car.price)}</div>
                    <button className="btn btn-primary">Подробнее</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedCar && (
        <div className="modal" onClick={() => setSelectedCar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedCar(null)}>×</button>
            <img src={selectedCar.image} alt={`${selectedCar.brand} ${selectedCar.model}`} className="modal-image" />
            <div className="modal-info">
              <h2>{selectedCar.brand} {selectedCar.model}</h2>
              <p className="modal-year">{selectedCar.year} год</p>
              <div className="modal-specs">
                <div className="spec-item">
                  <span className="spec-label">Пробег:</span>
                  <span>{selectedCar.mileage.toLocaleString('ru-RU')} км</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Топливо:</span>
                  <span>{selectedCar.fuel}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Коробка:</span>
                  <span>{selectedCar.transmission}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Цвет:</span>
                  <span>{selectedCar.color}</span>
                </div>
              </div>
              <p className="modal-description">{selectedCar.description}</p>
              <div className="modal-price">{formatPrice(selectedCar.price)}</div>
              <div className="modal-actions">
                <button className="btn btn-primary">Связаться с продавцом</button>
                <button className="btn btn-secondary">Добавить в избранное</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CarSale</h3>
              <p>Лучшая платформа для покупки и продажи автомобилей</p>
            </div>
            <div className="footer-section">
              <h4>Контакты</h4>
              <p>Телефон: +7 (999) 123-45-67</p>
              <p>Email: info@carsale.ru</p>
            </div>
            <div className="footer-section">
              <h4>Следите за нами</h4>
              <div className="social-links">
                <a href="#">VK</a>
                <a href="#">Telegram</a>
                <a href="#">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;