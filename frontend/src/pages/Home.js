// src/pages/Home.js
import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
function Home() {
  const [file, setFile] = useState(null);
  const [gridSize, setGridSize] = useState(10);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("이미지를 선택해주세요!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("grid_size", gridSize.toString());

    try {
      const res = await axios.post('/api/nonogram/', formData, {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(res.data);
      setResultImageUrl(imageUrl);
    } catch (err) {
      alert("변환 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>🧩 Nonogram 생성기</h1>

        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />

        <input
          type="number"
          min={5}
          max={50}
          value={gridSize}
          onChange={e => setGridSize(Number(e.target.value))}
          placeholder="Grid Size (예: 10)"
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "변환 중..." : "이미지 변환"}
        </button>

        {resultImageUrl && (
          <div className="result">
            <h2>결과 이미지</h2>
            <img src={resultImageUrl} alt="Nonogram Result" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
