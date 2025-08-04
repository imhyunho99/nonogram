// src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('https://nonogram.duckdns.org/user/register/', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      alert('회원가입 성공! 로그인 해주세요.');
      navigate('/');
    } catch (error) {
      alert('회원가입 실패: ' + (error.response?.data?.detail || '오류'));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>회원가입</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="username"
            placeholder="사용자 이름"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password2"
            placeholder="비밀번호 확인"
            value={formData.password2}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>회원가입</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    border: 'none',
    borderBottom: '2px solid #ccc',
    marginBottom: '25px',
    padding: '10px 5px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Register;
