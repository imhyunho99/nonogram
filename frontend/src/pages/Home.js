import './Home.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import SuggestionModal from '../components/SuggestionModal';

function Home() {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [imageList, setImageList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('access');

  useEffect(() => {
    if (!token) {
      navigate('/'); // 수정됨
      return;
    }
    fetchImageList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await axios.post('/image/origin/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUploadMessage('이미지 업로드 성공!');
      setFile(null);
      document.querySelector('input[type="file"]').value = '';
      fetchImageList();
    } catch (error) {
      console.error(error);
      setUploadMessage('업로드 실패. 다시 시도해주세요.');
      if (error.response?.status === 401) {
        navigate('/'); // 수정됨
      }
    }
  };

  const handleImageClick = (originImage) => {
    const size = prompt('Nonogram의 grid size를 입력해주세요 (10~40)');
    const grid = parseInt(size, 10);
    if (!isNaN(grid) && grid >= 10 && grid <= 40) {
      navigate(`/game/${originImage.id}?grid=${grid}`);
    } else {
      alert('10에서 40 사이의 올바른 숫자를 입력해주세요.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = 'https://nonogram.duckdns.org/';
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const openSuggestionModal = () => {
    setIsModalOpen(true);
  };

  const closeSuggestionModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="home-layout">
      <div className="sidebar">
        <div className="sidebar-header">
            <h3>MENU</h3>
        </div>
        <ul className="sidebar-menu">
          <li onClick={handleLogout}>로그아웃</li>
          <li onClick={handleEditProfile}>회원정보 수정</li>
          <li onClick={openSuggestionModal}>제안하기</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="container">
          <h2>이미지 업로드</h2>
          <div className="upload-section">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>업로드</button>
          </div>
          <p>{uploadMessage}</p>

          <h3>업로드한 이미지 목록</h3>
          <div className="image-list">
            {Array.isArray(imageList.results) && imageList.results.length > 0 ? (
              imageList.results.map((img) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt="origin"
                  className="thumbnail"
                  onClick={() => handleImageClick(img)}
                />
              ))
            ) : (
              <p>업로드된 이미지가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <SuggestionModal isOpen={isModalOpen} onClose={closeSuggestionModal} />
    </div>
  );
}

export default Home;
