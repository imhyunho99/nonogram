// src/pages/Game.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import './Game.css';

const Game = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const size = parseInt(searchParams.get('grid'));
  const navigate = useNavigate();

  const [gridData, setGridData] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await axios.post('http://localhost:8000/image/create/', {
          origin_id: id,
          size: size,
        });
        const parsedGrid = JSON.parse(response.data.image_data);
        setGridData(parsedGrid);
        setUserGrid(Array(size).fill().map(() => Array(size).fill(0)));
        computeHints(parsedGrid);
      } catch (err) {
        console.error("Error fetching puzzle:", err);
      }
    };

    if (id && size) fetchPuzzle();
  }, [id, size]);

  const computeHints = (grid) => {
    const getHints = (line) =>
      line.join('').split('0').filter(Boolean).map(group => group.length) || [0];

    const rows = grid.map(getHints);
    const cols = Array(size).fill().map((_, colIdx) => {
      const col = grid.map(row => row[colIdx]);
      return getHints(col);
    });

    setRowHints(rows);
    setColHints(cols);
  };

  const toggleCell = (row, col) => {
    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = newGrid[row][col] ? 0 : 1;
    setUserGrid(newGrid);

    if (JSON.stringify(newGrid) === JSON.stringify(gridData)) {
      setTimeout(() => {
        alert("🎉 퍼즐을 완성했습니다!");
        navigate(`/image/origin/${id}`);
      }, 200);
    }
  };

  const maxColHintHeight = Math.max(...colHints.map(c => c.length));
  const maxRowHintWidth = Math.max(...rowHints.map(r => r.length));

  return (
    <div className="game-container">
      {gridData.length > 0 ? (
        <div className="nonogram-wrapper">
          {/* 상단 힌트 */}
          <div className="top-hints-row">
            <div className="empty-corner" style={{ width: `${maxRowHintWidth * 20}px`, height: `${maxColHintHeight * 20}px` }} />
            <div className="top-hints">
              {colHints.map((col, colIdx) => (
                <div
                  className="col-hint"
                  key={colIdx}
                  style={{ height: `${maxColHintHeight * 20}px` }}
                >
                  {Array(maxColHintHeight).fill().map((_, i) => (
                    <div key={i} className="hint-number">
                      {col[col.length - maxColHintHeight + i] || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 좌측 힌트 + 게임 그리드 */}
          <div className="main-area">
            <div className="row-hints">
              {rowHints.map((row, rowIdx) => (
                <div
                  className="row-hint"
                  key={rowIdx}
                  style={{ width: `${maxRowHintWidth * 20}px` }}
                >
                  {Array(maxRowHintWidth - row.length).fill().map((_, i) => (
                    <div key={`empty-${i}`} className="hint-number" />
                  ))}
                  {row.map((n, i) => (
                    <div key={i} className="hint-number">{n}</div>
                  ))}
                </div>
              ))}
            </div>

            <div className="grid">
              {userGrid.map((row, rowIdx) => (
                <div className="grid-row" key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <div
                      className={`grid-cell ${cell ? 'clicked' : ''}`}
                      key={colIdx}
                      onClick={() => toggleCell(rowIdx, colIdx)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading puzzle...</p>
      )}
    </div>
  );
};

export default Game;
