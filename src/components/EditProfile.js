import React, { useState, useEffect } from 'react';
import './EditProfile.css'; // Создадим файл стилей

const EditProfile = () => {
  const [user, setUser] = useState({
    имя: '',
    фамилия: '',
    отчество: '',
    email: '',
    телефон: '',
    аватар: ''
  });
  const [previewAvatar, setPreviewAvatar] = useState('');

  // Загрузка данных о текущем пользователе из JSON (предположим, это фиксированный ID)
  useEffect(() => {
    fetch('/users.json') // Путь к вашему JSON файлу
      .then(response => response.json())
      .then(data => {
        // Имитация получения данных текущего пользователя (например, по ID)
        const currentUser = data.find(u => u.id === 1001); // ID 1001 как пример текущего пользователя
        if (currentUser) {
          setUser({
            имя: currentUser.имя,
            фамилия: currentUser.фамилия,
            отчество: currentUser.отчество,
            email: currentUser.email,
            телефон: currentUser.телефон,
            аватар: currentUser.аватар // URL или путь к аватару
          });
          setPreviewAvatar(currentUser.аватар);
        } else {
          console.error('Пользователь не найден');
        }
      })
      .catch(error => console.error('Ошибка загрузки данных:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Создаем URL для предпросмотра
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
        // В реальном приложении здесь бы отправлялась ссылка на файл или сам файл на сервер
        // setUser(prev => ({ ...prev, аватар: reader.result })); // Это для демонстрации, обычно аватар - это URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь логика сохранения изменений (в реальном приложении - через API)
    console.log('Данные профиля обновлены:', user);
    alert('Профиль успешно обновлен!');
    // После успешного сохранения можно вернуться на страницу профиля
    // history.push('/profile');
  };

  return (
    <div className="edit-profile-container">
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
          <img src={previewAvatar || user.аватар} alt="Аватар пользователя" className="avatar-img" />
        </div>
      </header>

      {/* Основной контент */}
      <main className="main-content">
        <div className="edit-profile-card">
          <h1>Редактировать профиль</h1>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group avatar-group">
              <label>Аватар</label>
              <div className="avatar-preview-container">
                <img src={previewAvatar || user.аватар} alt="Предпросмотр аватара" className="avatar-preview" />
              </div>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="avatar-input"
              />
              <label htmlFor="avatar" className="btn-upload">Загрузить аватар</label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="фамилия">Фамилия</label>
                <input
                  type="text"
                  id="фамилия"
                  name="фамилия"
                  value={user.фамилия}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="имя">Имя</label>
                <input
                  type="text"
                  id="имя"
                  name="имя"
                  value={user.имя}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="отчество">Отчество</label>
                <input
                  type="text"
                  id="отчество"
                  name="отчество"
                  value={user.отчество}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="телефон">Телефон</label>
              <input
                type="tel"
                id="телефон"
                name="телефон"
                value={user.телефон}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">сохранить</button>
              <a href="profile.html" className="btn-cancel">отмена</a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;