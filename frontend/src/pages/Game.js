import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

function Game() {
  const { originId } = useParams(); // /game/:originId
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const gridSize = parseInt(queryParams.get('grid'), 10); // ?grid=30

  return (
    <div>
      <h2>게임 시작!</h2>
      <p>이미지 ID: {originId}</p>
      <p>그리드 크기: {gridSize} x {gridSize}</p>

      {/* 그리드 UI 생성 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 20px)` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '20px',
              height: '20px',
              border: '1px solid #aaa',
              boxSizing: 'border-box',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;
