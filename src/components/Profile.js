import React, { useState, useEffect } from 'react';
import './Profile.css'; // Создадим файл стилей

const Profile = () => {
  const [user, setUser] = useState(null);

  // Загрузка данных о текущем пользователе из JSON (предположим, это фиксированный ID)
  useEffect(() => {
    fetch('/users.json') // Путь к вашему JSON файлу
      .then(response => response.json())
      .then(data => {
        // Имитация получения данных текущего пользователя (например, по ID)
        const currentUser = data.find(u => u.id === 1001); // ID 1001 как пример текущего пользователя
        if (currentUser) {
          setUser(currentUser);
        } else {
          console.error('Пользователь не найден');
        }
      })
      .catch(error => console.error('Ошибка загрузки данных:', error));
  }, []);

  if (!user) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="profile-container">
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
          <a href="sessions.html" className="nav-link">аналитические сессии</a>
        </nav>
        <div className="user-avatar">
          <img src={user.аватар} alt="Аватар пользователя" className="avatar-img" />
        </div>
      </header>

      {/* Основной контент */}
      <main className="main-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <img src={user.аватар} alt="Аватар пользователя" className="profile-avatar" />
            </div>
            <div className="profile-info">
              <h1>{user.имя} {user.фамилия}</h1>
              <p className="role">{user.роль}</p>
              <p className="status">В сети: {user.в_сети}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <h3>Контактная информация</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Телефон:</strong> {user.телефон}</p>
            </div>
            <div className="detail-group">
              <h3>Дополнительно</h3>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Отчество:</strong> {user.отчество}</p>
            </div>
          </div>

          <div className="profile-actions">
            <a href="edit_profile.html" className="btn-edit">изменить профиль</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;