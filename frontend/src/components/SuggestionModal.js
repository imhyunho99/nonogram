import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import './SuggestionModal.css';

function SuggestionModal({ isOpen, onClose }) {
  const [suggestion, setSuggestion] = useState('');
  const [message, setMessage] = useState('');

  const handleSuggestionSubmit = async () => {
    if (!suggestion.trim()) {
      setMessage('내용을 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('access');
    if (!token) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.post('/suggestion/create/', {
        content: suggestion
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('제안이 성공적으로 제출되었습니다!');
      setSuggestion('');
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 1500);
    } catch (error) {
      console.error('제안 제출 실패:', error);
      setMessage('제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>제안하기</h2>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="서비스 개선을 위한 아이디어나 불편한 점을 제안해주세요."
          rows="8"
        />
        <div className="modal-actions">
          <button onClick={handleSuggestionSubmit} className="submit-btn">제안하기</button>
          <button onClick={onClose} className="cancel-btn">취소</button>
        </div>
        {message && <p className="modal-message">{message}</p>}
      </div>
    </div>
  );
}

export default SuggestionModal;