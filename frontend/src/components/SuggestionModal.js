// src/components/SuggestionModal.js
import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import './SuggestionModal.css';

function SuggestionModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSuggestionSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      setResponseMsg('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('access');
    if (!token) {
      setResponseMsg('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.post('/suggestion/create/', {
        title: title,
        message: message
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponseMsg('제안이 성공적으로 제출되었습니다!');
      setTitle('');
      setMessage('');
      setTimeout(() => {
        onClose();
        setResponseMsg('');
      }, 1500);
    } catch (error) {
      console.error('제안 제출 실패:', error);
      setResponseMsg('제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>제안하기</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="modal-input"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="서비스 개선을 위한 아이디어나 불편한 점을 제안해주세요."
          rows="6"
          className="modal-textarea"
        />
        <div className="modal-actions">
          <button onClick={handleSuggestionSubmit} className="submit-btn">제안하기</button>
          <button onClick={onClose} className="cancel-btn">취소</button>
        </div>
        {responseMsg && <p className="modal-message">{responseMsg}</p>}
      </div>
    </div>
  );
}

export default SuggestionModal;
