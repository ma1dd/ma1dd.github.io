import React, { useState, useEffect } from 'react';
import './Sessions.css'; // Создадим файл стилей

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    user: '',
    dateRange: '' // Можно расширить до календаря
  });

  // Загрузка данных о сессиях из JSON
  useEffect(() => {
    fetch('/sessions.json') // Путь к вашему JSON файлу
      .then(response => response.json())
      .then(data => {
        setSessions(data);
        setFilteredSessions(data); // Изначально отображаем все
      })
      .catch(error => console.error('Ошибка загрузки данных:', error));
  }, []);

  // Применение фильтров
  useEffect(() => {
    let result = sessions;

    if (filters.searchTerm) {
      result = result.filter(s => s.анализ.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    }
    if (filters.user) {
      result = result.filter(s => s.пользователь.имя === filters.user);
    }
    // Простой фильтр по дню (для демонстрации)
    if (filters.dateRange) {
      const now = new Date();
      let daysBack = 7; // по умолчанию за 7 дней
      switch (filters.dateRange) {
        case 'today':
          daysBack = 1;
          break;
        case 'week':
          daysBack = 7;
          break;
        case 'month':
          daysBack = 30;
          break;
        default:
          break;
      }
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);
      result = result.filter(s => new Date(s.дата_анализа) >= cutoffDate);
    }

    setFilteredSessions(result);
  }, [filters, sessions]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Упрощенный список пользователей для фильтра
  const users = [...new Set(sessions.map(s => s.пользователь.имя))];

  return (
    <div className="sessions-container">
      {/* Шапка сайта */}
      <header className="header">
        <div className="logo-container">
          {/* Используйте путь к вашему логотипу */}
          <img src="/SanStar.png" alt="SanStar Логотип" className="logo" />
          <span className="logo-text">аналитика</span>
        </div>
        <nav className="nav-menu">
          <a href="index.html" className="nav-link">главная</a>
          <a href="products.html" className="nav-link">товары</a>
          <a href="sessions.html" className="nav-link active">аналитические сессии</a> {/* Активная ссылка */}
        </nav>
        <div className="user-avatar">
          <div className="avatar-circle"></div>
        </div>
      </header>

      {/* Панель фильтров (выезжает сверху) */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Фильтры сессий</h3>
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
                placeholder="Описание анализа..."
              />
            </div>
            <div className="filter-group">
              <label htmlFor="user">Пользователь:</label>
              <select id="user" name="user" value={filters.user} onChange={handleFilterChange}>
                <option value="">Все</option>
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="dateRange">Период:</label>
              <select id="dateRange" name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
                <option value="">Все время</option>
                <option value="today">Сегодня</option>
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
              </select>
            </div>
            <div className="filter-actions">
              <button onClick={() => setFilters({ searchTerm: '', user: '', dateRange: '' })} className="btn-reset">Сбросить</button>
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <main className="main-content">
        <div className="sessions-header">
          <h1>Аналитические сессии</h1>
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

        <div className="sessions-table">
          <div className="table-header">
            <div className="table-col table-col-analysis">анализ</div>
            <div className="table-col table-col-date">дата</div>
            <div className="table-col table-col-user">пользователь</div>
          </div>
          <div className="table-body">
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <div key={session.id} className="table-row">
                  <div className="table-cell table-cell-analysis">{session.анализ}</div>
                  <div className="table-cell table-cell-date">{new Date(session.дата_анализа).toLocaleDateString()}</div>
                  <div className="table-cell table-cell-user">{session.пользователь.имя} ({session.пользователь.роль})</div>
                </div>
              ))
            ) : (
              <div className="table-row no-results-row">
                <div className="table-cell">Сессии не найдены.</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sessions;