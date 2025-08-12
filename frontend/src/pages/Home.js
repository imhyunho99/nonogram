// src/pages/Home.js
import './Home.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

function Home() {
  const [file, setFile] = useState(null);
  const [originId, setOriginId] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [imageList, setImageList] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('access');


  useEffect(() => {
    fetchImageList();
  }, []);

  const fetchImageList = async () => {
    try {
      const res = await axios.get('/image/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImageList(res.data);
    } catch (error) {
      console.error('이미지 목록 불러오기 실패:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/image/origin/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOriginId(res.data.id);
      setUploadMessage('이미지 업로드 성공!');
      setFile(null);
      fetchImageList();  // 업로드 후 목록 갱신
    } catch (error) {
      console.error(error);
      setUploadMessage('업로드 실패. 로그인 상태를 확인해주세요.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleImageClick = (originImage) => {
    const size = prompt('Nonogram의 grid size를 입력해주세요 (10~40)');
    const grid = parseInt(size, 10);
    if (!isNaN(grid) && grid > 0) {
      console.log(`Navigating to /game/${originImage.id}?grid=${grid}`);  // <-- 디버깅
      navigate(`/game/${originImage.id}?grid=${grid}`);
    } else {
      alert('올바른 숫자를 입력해주세요.');
    }
  };

  return (
    <div className="container">
      <h2>이미지 업로드</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>
      <p>{uploadMessage}</p>

      <h3>업로드한 이미지 목록</h3>
      <div className="image-list">
       {Array.isArray(imageList.results) && imageList.results.map((img) => (
          <img
            key={img.id}
            src={img.image}  // 이미 백엔드에서 full URL을 주고 있으니 그대로 사용
            alt="origin"
            className="thumbnail"
            onClick={() => handleImageClick(img)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
