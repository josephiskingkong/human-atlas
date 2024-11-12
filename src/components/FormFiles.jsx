import React, { useState } from 'react';
import { addOrgan } from '../api/add-organ';
import "../styles/llistOrgans/form-files.css";
import "../styles/map.css"

export default function FormFiles() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Обработчик изменения выбранного файла
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Обработчик изменения имени органа
  const handleNameChange = (event) => {
    console.log(name);

    setName(event.target.value);
  };

  // Обработчик изменения категории органа
  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(file);
    console.log(name);

    if (!file || !name) {
      setError('Пожалуйста, заполните все поля и выберите файл.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('categoryid', 1);

    addOrgan(formData);
  };

  return (
    <div className='form-files'>
      <h1>Добавить слайд</h1>
      <form onSubmit={handleSubmit}>
        <div className='name-container'>
          <label>Имя слайда:</label>
          <input type="text" value={name} onChange={handleNameChange} required />
        </div>
        {/* <div>
          <label>Категория органа:</label>
          <input type="text" value={categoryId} onChange={handleCategoryChange} required />
        </div> */}
        <div className='file-container'>
          <label>Файл (только .svs):</label>
          <input type="file" accept=".svs" onChange={handleFileChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit" className='button-save'>Загрузить орган</button>
      </form>
    </div>
  );
}