import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const data = await login(email, password);

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      if (onLogin) onLogin(data.user);

      navigate('/home');
    } catch (error) {
      console.error("로그인 실패! 전체 에러 객체:", error); // 전체 에러 확인용
      if (error.response) {
        console.error("🔥 서버 응답 데이터:", error.response.data);
        alert('로그인 실패: ' + JSON.stringify(error.response.data));
      } else {
        alert('유효하지 않은 회원정보이거나 네트워크에 문제가 있습니다.');
      }
      // --------------------------
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <h2> 로그인</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>로그인</button>
        <button type="button" onClick={handleRegisterClick} style={styles.registerButton}>
          회원가입
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '80px auto',
    padding: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderBottom: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  registerButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;

