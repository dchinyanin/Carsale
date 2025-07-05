import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car } from '../types';

interface CarContextType {
  cars: Car[];
  addCar: (car: Omit<Car, 'id' | 'createdAt'>) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  getCar: (id: string) => Car | undefined;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);

  // Загружаем данные из localStorage при инициализации
  useEffect(() => {
    const savedCars = localStorage.getItem('cars');
    if (savedCars) {
      try {
        const parsedCars = JSON.parse(savedCars);
        setCars(parsedCars.map((car: any) => ({
          ...car,
          createdAt: new Date(car.createdAt)
        })));
      } catch (error) {
        console.error('Error parsing saved cars:', error);
      }
    }
  }, []);

  // Сохраняем в localStorage при изменении списка авто
  useEffect(() => {
    localStorage.setItem('cars', JSON.stringify(cars));
  }, [cars]);

  const addCar = (carData: Omit<Car, 'id' | 'createdAt'>) => {
    const newCar: Car = {
      ...carData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setCars(prev => [...prev, newCar]);
  };

  const updateCar = (id: string, updates: Partial<Car>) => {
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, ...updates } : car
    ));
  };

  const deleteCar = (id: string) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const getCar = (id: string) => {
    return cars.find(car => car.id === id);
  };

  return (
    <CarContext.Provider value={{
      cars,
      addCar,
      updateCar,
      deleteCar,
      getCar,
    }}>
      {children}
    </CarContext.Provider>
  );
};