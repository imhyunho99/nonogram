import React, { useState } from 'react';
import { uploadOriginImage } from '../api/nonogram';  // 🔥 generateNonogram 제거
import './Home.css';

function Home() {
  const [file, setFile] = useState(null);
  const [originInfo, setOriginInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    setLoading(true);

    try {
      // ✅ 1단계: 이미지 업로드만 수행
      const origin = await uploadOriginImage(file);
      setOriginInfo(origin);  // origin에는 id, uploaded_at 등 정보 있음
    } catch (error) {
      console.error("에러 발생:", error);
      alert("업로드 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🧩 네모로직 이미지 업로드</h1>

      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "업로드 중..." : "이미지 업로드"}
      </button>

      {originInfo && (
        <div className="result">
          <h2>✅ 업로드 완료</h2>
          <p>이미지 ID: {originInfo.id}</p>
          <p>업로드 시간: {originInfo.uploaded_at}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
