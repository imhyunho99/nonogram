// src/pages/Home.js
import './Home.css';

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [file, setFile] = useState(null);
  const [originId, setOriginId] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image_data', file);  // <-- 중요: 백엔드 필드명과 맞춰야 함
    try {
      const token = localStorage.getItem('access');
      const res = await axios.post('http://localhost:8000/image/origin/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setOriginId(res.data.id); // 서버가 반환하는 origin image id
      setUploadMessage('이미지 업로드 성공!');
    } catch (error) {
      console.error(error);
      setUploadMessage('업로드 실패. 로그인 상태를 확인해주세요.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div>
      <h2>이미지 업로드</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>
      <p>{uploadMessage}</p>
      {originId && <p>Origin ID: {originId}</p>}
    </div>
  );
}

export default Home;
