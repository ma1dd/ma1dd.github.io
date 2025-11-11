import React, { useState, useEffect } from 'react';
import './Products.css'; // Создадим файл стилей

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    rating: '',
    sentiment: '',
    source: ''
  });

  // Загрузка данных о продуктах из JSON
  useEffect(() => {
    fetch('/products.json') // Путь к вашему JSON файлу
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data); // Изначально отображаем все
      })
      .catch(error => console.error('Ошибка загрузки данных:', error));
  }, []);

  // Применение фильтров
  useEffect(() => {
    let result = products;

    if (filters.searchTerm) {
      result = result.filter(p => p.название.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    }
    if (filters.category) {
      result = result.filter(p => p.категория.название === filters.category);
    }
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      result = result.filter(p => p.статистика_отзывов.средний_рейтинг >= minRating);
    }
    if (filters.sentiment) {
      const total = p.статистика_отзывов.всего_отзывов;
      if (total > 0) {
        const positivePercent = (p.статистика_отзывов.тональность.позитивных / total) * 100;
        const negativePercent = (p.статистика_отзывов.тональность.негативных / total) * 100;
        switch (filters.sentiment) {
          case 'positive':
            return positivePercent > negativePercent;
          case 'negative':
            return negativePercent > positivePercent;
          case 'neutral':
            return Math.abs(positivePercent - negativePercent) < 10; // Условие для "нейтрального"
          default:
            return true;
        }
      }
    }
    if (filters.source) {
      result = result.filter(p => p.источники_продаж.some(s => s.название === filters.source));
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Упрощенный список категорий и источников для фильтров
  const categories = [...new Set(products.map(p => p.категория.название))];
  const sources = [...new Set(products.flatMap(p => p.источники_продаж.map(s => s.название)))];

  return (
    <div className="products-container">
      {/* Шапка сайта */}
      <header className="header">
        <div className="logo-container">
          {/* Используйте путь к вашему логотипу */}
          <img src="/SanStar.png" alt="SanStar Логотип" className="logo" />
          <span className="logo-text">аналитика</span>
        </div>
        <nav className="nav-menu">
          <a href="index.html" className="nav-link">главная</a>
          <a href="products.html" className="nav-link active">товары</a> {/* Активная ссылка */}
          <a href="sessions.html" className="nav-link">аналитические сессии</a>
        </nav>
        <div className="user-avatar">
          <div className="avatar-circle"></div>
        </div>
      </header>

      {/* Панель фильтров (выезжает сверху) */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Фильтры товаров</h3>
            <button onClick={toggleFilters} className="close-btn">×</button>
          </div>
          <div className="filters-content">
            <div className="filter-group">
              <label htmlFor="searchTerm">Поиск:</label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Название товара..."
              />
            </div>
            <div className="filter-group">
              <label htmlFor="category">Категория:</label>
              <select id="category" name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">Все</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="rating">Мин. рейтинг:</label>
              <select id="rating" name="rating" value={filters.rating} onChange={handleFilterChange}>
                <option value="">Любой</option>
                <option value="5">5.0 и выше</option>
                <option value="4">4.0 и выше</option>
                <option value="3">3.0 и выше</option>
                <option value="2">2.0 и выше</option>
                <option value="1">1.0 и выше</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="sentiment">Тональность:</label>
              <select id="sentiment" name="sentiment" value={filters.sentiment} onChange={handleFilterChange}>
                <option value="">Любая</option>
                <option value="positive">Позитивная</option>
                <option value="negative">Негативная</option>
                <option value="neutral">Нейтральная</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="source">Источник:</label>
              <select id="source" name="source" value={filters.source} onChange={handleFilterChange}>
                <option value="">Все</option>
                {sources.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>
            <div className="filter-actions">
              <button onClick={() => setFilters({ searchTerm: '', category: '', rating: '', sentiment: '', source: '' })} className="btn-reset">Сбросить</button>
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <main className="main-content">
        <div className="products-header">
          <h1>Товары</h1>
          <div className="search-filter-bar">
            <input
              type="text"
              placeholder="поиск..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              name="searchTerm"
              className="search-input"
            />
            <button onClick={toggleFilters} className="btn-filter">фильтры</button>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.название}</h3>
                <p className="product-description">{product.описание}</p>
                <div className="product-stats">
                  <div className="stat">
                    <span>Цена:</span> <strong>{product.цена} ₽</strong>
                  </div>
                  <div className="stat">
                    <span>Рейтинг:</span> <strong>{product.статистика_отзывов.средний_рейтинг.toFixed(1)}</strong>
                  </div>
                  <div className="stat">
                    <span>Отзывов:</span> <strong>{product.статистика_отзывов.всего_отзывов}</strong>
                  </div>
                  <div className="stat">
                    <span>Позитивных:</span> <strong>{((product.статистика_отзывов.тональность.позитивных / product.статистика_отзывов.всего_отзывов) * 100).toFixed(0)}%</strong>
                  </div>
                </div>
                <div className="product-sources">
                  <span>Источники:</span>
                  {product.источники_продаж.map(source => (
                    <span key={source.id} className="source-tag">{source.название}</span>
                  ))}
                </div>
                <div className="product-topics">
                  <span>Темы:</span>
                  <ul>
                    {product.статистика_отзывов.топ_тем.slice(0, 3).map((topic, index) => ( // Показываем только первые 3 темы
                      <li key={index}>{topic.название} ({topic.упоминаний} упом., {topic.негатив} нег.)</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">Товары не найдены.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;