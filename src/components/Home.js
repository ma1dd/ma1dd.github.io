import React, { useState, useEffect } from 'react';
import './Home.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [sessions, setSessions] = useState([]);

  // Загрузка данных о сессиях из JSON
  useEffect(() => {
    fetch('/sessions.json')
      .then(response => response.json())
      .then(data => setSessions(data.slice(0, 4))); // Берем первые 4 сессии для отображения
  }, []);

  // Данные для графика "Динамика тональности"
  const chartData = {
    labels: ['День 1', 'День 2', 'День 3', 'День 4', 'День 5', 'День 6', 'День 7'],
    datasets: [
      {
        label: 'Процент позитивных отзывов',
        data: [65, 80, 70, 85, 75, 90, 82],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Процент (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Дни'
        }
      }
    }
  };

  // Обработчик для кнопки "фильтры"
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Обработчик для кнопки "загрузить ещё" (просто добавляет еще 4 сессии)
  const loadMoreSessions = () => {
    fetch('/sessions.json')
      .then(response => response.json())
      .then(data => {
        const newSessions = data.slice(4, 8); // Берем следующие 4 сессии
        setSessions(prev => [...prev, ...newSessions]);
      });
  };

  return (
    <div className="home-container">
      {/* Шапка сайта */}
      <header className="header">
        <div className="logo-container">
          <img src="/SanStar.png" alt="SanStar Логотип" className="logo" />
          <span className="logo-text">аналитика</span>
        </div>
        <nav className="nav-menu">
          <a href="index.html" className="nav-link">главная</a>
          <a href="products.html" className="nav-link">товары</a>
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
            <h3>Фильтры</h3>
            <button onClick={toggleFilters} className="close-btn">×</button>
          </div>
          <div className="filters-content">
            <div className="filter-group">
              <label>По дате загрузки:</label>
              <select>
                <option>За последний час</option>
                <option>Сегодня</option>
                <option>За эту неделю</option>
                <option>За этот месяц</option>
                <option>За этот год</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Тип:</label>
              <select>
                <option>Видео</option>
                <option>Каналы</option>
                <option>Плейлисты</option>
                <option>Фильмы</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Длительность:</label>
              <select>
                <option>Менее 4 минут</option>
                <option>От 4 до 20 минут</option>
                <option>Более 20 минут</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Особенности:</label>
              <div className="checkbox-group">
                <label><input type="checkbox" /> Прямые трансляции</label>
                <label><input type="checkbox" /> 4K</label>
                <label><input type="checkbox" /> HD</label>
                <label><input type="checkbox" /> Субтитры</label>
                <label><input type="checkbox" /> Лицензия Creative Commons</label>
                <label><input type="checkbox" /> 360°</label>
                <label><input type="checkbox" /> VR180</label>
                <label><input type="checkbox" /> В формате 3D</label>
                <label><input type="checkbox" /> HDR</label>
                <label><input type="checkbox" /> Место съемки</label>
                <label><input type="checkbox" /> Приобретено</label>
              </div>
            </div>
            <div className="filter-group">
              <label>Упорядочить по:</label>
              <select>
                <option>По релевантности</option>
                <option>По дате загрузки</option>
                <option>По числу просмотров</option>
                <option>По рейтингу</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <main className="main-content">
        {/* Блоки KPI */}
        <div className="kpi-section">
          <div className="kpi-card">
            <h2>Общая статистика</h2>
            <div className="kpi-list">
              <div className="kpi-item">
                <span>Всего отзывов</span>
                <span>12 487</span>
              </div>
              <div className="kpi-item">
                <span>Средний рейтинг</span>
                <span>4.3 / 5</span>
              </div>
              <div className="kpi-item">
                <span>Процент позитивных отзывов</span>
                <span>78%</span>
              </div>
              <div className="kpi-item">
                <span>Активных источников</span>
                <span>5</span>
              </div>
              <div className="kpi-item">
                <span>Новых продуктов</span>
                <span>24</span>
              </div>
            </div>
            <button className="btn-details">подробнее</button>
          </div>

          <div className="kpi-card">
            <h2>Динамика тональности</h2>
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className="chart-controls">
              <button className="btn-period active">за последние <span>7</span> дней</button>
              <button className="btn-details">подробнее</button>
            </div>
          </div>
        </div>

        {/* Секция "Последние аналитические сессии" */}
        <div className="sessions-section">
          <div className="section-header">
            <h2>Последние аналитические сессии</h2>
            <div className="search-filter">
              <input type="text" placeholder="поиск..." className="search-input" />
              <button onClick={toggleFilters} className="btn-filter">фильтры</button>
            </div>
          </div>

          <div className="sessions-table">
            <div className="table-header">
              <div className="table-col">анализ</div>
              <div className="table-col">дата</div>
            </div>
            <div className="table-body">
              {sessions.map(session => (
                <div key={session.id} className="table-row">
                  <div className="table-cell">{session.анализ}</div>
                  <div className="table-cell">
                    <span>{new Date(session.дата_анализа).toLocaleDateString()}</span>
                    <span className="more-options">•••</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={loadMoreSessions} className="btn-load-more">загрузить ещё</button>
        </div>
      </main>
    </div>
  );
};

export default Home;