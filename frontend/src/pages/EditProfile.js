import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import './EditProfile.css';

function EditProfile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
        setError('새 비밀번호는 8자 이상이어야 합니다.');
        return;
    }

    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/'); // 수정됨
      return;
    }

    try {
      await axios.put('/user/update/', {
        old_password: currentPassword,   // ✅ 서버가 이해하는 키
        new_password: newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');

      localStorage.removeItem('access');
      localStorage.removeItem('refresh');

      setTimeout(() => {
        navigate('/'); // 수정됨
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
      console.error('업데이트 실패:', err);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-form">
        <h2>회원정보 수정</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>현재 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="update-btn">비밀번호 변경</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <button onClick={() => navigate('/home')} className="back-btn">
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
