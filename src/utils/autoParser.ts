// Улучшенный парсер для Auto.ru с реальным извлечением данных
export const parseAutoRuUrl = async (url: string) => {
  try {
    const urlObj = new URL(url);
    
    // Проверяем, что это Auto.ru
    if (!urlObj.hostname.includes('auto.ru')) {
      return null;
    }

    // Попытка извлечь ID объявления из URL
    const pathParts = urlObj.pathname.split('/');
    let adId = '';
    
    // Ищем ID в конце URL
    for (let i = pathParts.length - 1; i >= 0; i--) {
      if (pathParts[i] && pathParts[i].match(/^\d+$/)) {
        adId = pathParts[i];
        break;
      }
    }

    // Если нашли ID, попробуем получить данные через их API
    if (adId) {
      try {
        // Auto.ru API endpoint (может потребовать CORS proxy в продакшене)
        const apiUrl = `https://auto.ru/api/1.0/offer/${adId}`;
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (response.ok) {
          const data = await response.json();
          return extractDataFromApiResponse(data);
        }
      } catch (apiError) {
        console.log('API request failed, trying page parsing:', apiError);
      }
    }

    // Fallback: парсим через прокси сервис для получения HTML
    return await parsePageThroughProxy(url);

  } catch (error) {
    console.error('Error parsing Auto.ru URL:', error);
    return null;
  }
};

// Извлечение данных из API ответа Auto.ru
const extractDataFromApiResponse = (data: any) => {
  try {
    const offer = data.offer || data;
    
    return {
      name: buildCarName(offer),
      year: offer.vehicle_info?.year || offer.year || new Date().getFullYear(),
      price: offer.price_info?.price || offer.price || 0,
      mileage: offer.vehicle_info?.run || offer.run || 0,
      imageUrl: getFirstImage(offer.photo || offer.images),
      source: 'auto.ru'
    };
  } catch (error) {
    console.error('Error extracting API data:', error);
    return null;
  }
};

// Построение названия автомобиля
const buildCarName = (offer: any) => {
  const brand = offer.vehicle_info?.mark_info?.name || offer.mark?.name || '';
  const model = offer.vehicle_info?.model_info?.name || offer.model?.name || '';
  const generation = offer.vehicle_info?.generation?.name || '';
  
  let name = `${brand} ${model}`.trim();
  if (generation && !name.includes(generation)) {
    name += ` ${generation}`;
  }
  
  return name || 'Автомобиль';
};

// Получение первого изображения
const getFirstImage = (photos: any) => {
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return '';
  }
  
  const firstPhoto = photos[0];
  if (typeof firstPhoto === 'string') {
    return firstPhoto;
  }
  
  // Auto.ru photo object structure
  if (firstPhoto.sizes) {
    const size = firstPhoto.sizes['1200x900'] || firstPhoto.sizes['orig'] || firstPhoto.sizes[Object.keys(firstPhoto.sizes)[0]];
    return size?.url || '';
  }
  
  return firstPhoto.url || '';
};

// Парсинг через прокси для обхода CORS
const parsePageThroughProxy = async (url: string) => {
  try {
    // Используем бесплатный CORS прокси (в продакшене лучше использовать свой)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Proxy request failed');
    }
    
    const data = await response.json();
    const html = data.contents;
    
    return extractDataFromHtml(html);
  } catch (error) {
    console.error('Proxy parsing failed:', error);
    return parseUrlFallback(url);
  }
};

// Извлечение данных из HTML
const extractDataFromHtml = (html: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Поиск JSON-LD данных
    const jsonLdScript = doc.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
      try {
        const jsonData = JSON.parse(jsonLdScript.textContent || '');
        if (jsonData['@type'] === 'Product' || jsonData['@type'] === 'Car') {
          return {
            name: jsonData.name || jsonData.model || 'Автомобиль',
            year: extractYear(jsonData.productionDate || jsonData.vehicleModelDate) || new Date().getFullYear(),
            price: parsePrice(jsonData.offers?.price || jsonData.price) || 0,
            mileage: parseInt(jsonData.mileageFromOdometer || '0') || 0,
            imageUrl: jsonData.image?.[0]?.url || jsonData.image || '',
            source: 'auto.ru'
          };
        }
      } catch (jsonError) {
        console.log('JSON-LD parsing failed:', jsonError);
      }
    }
    
    // Поиск в мета тегах
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    
    // Извлечение цены из мета тегов или текста
    const priceMatch = html.match(/(\d+\s*\d*)\s*₽|(\d+\s*\d*)\s*руб/i);
    const price = priceMatch ? parseInt(priceMatch[1]?.replace(/\s/g, '') || priceMatch[2]?.replace(/\s/g, '') || '0') : 0;
    
    // Извлечение года
    const yearMatch = ogTitle.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
    
    // Извлечение пробега
    const mileageMatch = ogDescription.match(/(\d+\s*\d*)\s*км/i);
    const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/\s/g, '')) : 0;
    
    return {
      name: cleanCarName(ogTitle) || 'Автомобиль',
      year,
      price,
      mileage,
      imageUrl: ogImage,
      source: 'auto.ru'
    };
    
  } catch (error) {
    console.error('HTML parsing failed:', error);
    return null;
  }
};

// Очистка названия автомобиля
const cleanCarName = (title: string) => {
  if (!title) return '';
  
  // Убираем лишние слова из заголовка
  return title
    .replace(/купить|продажа|б\/у|с пробегом|в москве|спб|auto\.ru/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Извлечение года из строки
const extractYear = (dateString: string) => {
  if (!dateString) return null;
  const match = dateString.match(/(\d{4})/);
  return match ? parseInt(match[1]) : null;
};

// Парсинг цены
const parsePrice = (priceString: any) => {
  if (typeof priceString === 'number') return priceString;
  if (typeof priceString !== 'string') return 0;
  
  const cleanPrice = priceString.replace(/[^\d]/g, '');
  return parseInt(cleanPrice) || 0;
};

// Fallback парсинг из URL (оригинальная логика)
const parseUrlFallback = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const searchParams = new URLSearchParams(urlObj.search);
    
    let carName = '';
    let year = 0;
    let price = 0;
    
    // Извлекаем марку и модель из пути
    if (pathParts.includes('cars')) {
      const carIndex = pathParts.indexOf('cars');
      if (pathParts[carIndex + 1] && pathParts[carIndex + 2]) {
        const brand = pathParts[carIndex + 1];
        const model = pathParts[carIndex + 2];
        carName = `${brand} ${model}`.replace(/_/g, ' ');
      }
    }
    
    // Извлекаем год из параметров
    if (searchParams.has('year_from')) {
      year = parseInt(searchParams.get('year_from') || '0');
    }
    
    // Извлекаем цену из параметров
    if (searchParams.has('price_to')) {
      price = parseInt(searchParams.get('price_to') || '0');
    }
    
    return {
      name: carName || 'Автомобиль',
      year: year || new Date().getFullYear(),
      price: price || 0,
      mileage: 0,
      imageUrl: '',
      source: 'auto.ru'
    };
  } catch (error) {
    console.error('URL fallback parsing failed:', error);
    return null;
  }
};

// Старые функции для совместимости
export const extractCarDataFromMeta = extractDataFromHtml;
export const getCarImageFromUrl = getFirstImage;

// Проверка валидности URL
export const isValidCarUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('auto.ru') || 
           urlObj.hostname.includes('avito.ru') || 
           urlObj.hostname.includes('drom.ru');
  } catch {
    return false;
  }
};

// Примеры URL для тестирования
export const SAMPLE_URLS = {
  autoRu: 'https://auto.ru/cars/bmw/x5/used/sale/1234567890/',
  avito: 'https://www.avito.ru/moskva/avtomobili/bmw_x5_2020_1234567890',
  drom: 'https://auto.drom.ru/bmw/x5/1234567890.html'
};