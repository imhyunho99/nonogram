// src/pages/Game.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';
import './Game.css';

const Game = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [gridData, setGridData] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [size, setSize] = useState(searchParams.get("grid"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/image/create/', {
          origin_id: id,
          size: size,
        });

        const parsedGrid = JSON.parse(response.data.image_data);
        setGridData(parsedGrid);
        setUserGrid(Array(parsedGrid.length).fill().map(() => Array(parsedGrid[0].length).fill(false)));
        setRowHints(generateRowHints(parsedGrid));
        setColHints(generateColHints(parsedGrid));
      } catch (error) {
        console.error("Error fetching puzzle data:", error);
      }
    };

    if (id && size) {
      fetchData();
    }
  }, [id, size]);

  const toggleCell = (rowIdx, colIdx) => {
    const updatedGrid = userGrid.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIdx && cIdx === colIdx ? !cell : cell
      )
    );
    setUserGrid(updatedGrid);
  };

  const generateRowHints = (grid) => {
    return grid.map(row => {
      const hints = [];
      let count = 0;
      row.forEach(cell => {
        if (cell) {
          count += 1;
        } else if (count > 0) {
          hints.push(count);
          count = 0;
        }
      });
      if (count > 0) hints.push(count);
      return hints.length ? hints : [0];
    });
  };

  const generateColHints = (grid) => {
    const colCount = grid[0].length;
    const hints = [];

    for (let col = 0; col < colCount; col++) {
      let count = 0;
      const colHint = [];

      for (let row = 0; row < grid.length; row++) {
        if (grid[row][col]) {
          count += 1;
        } else if (count > 0) {
          colHint.push(count);
          count = 0;
        }
      }
      if (count > 0) colHint.push(count);
      hints.push(colHint.length ? colHint : [0]);
    }
    return hints;
  };

  return (
    <div className="game-container">
      {gridData.length > 0 ? (
        <div className="nonogram-wrapper">
          <div className="nonogram-grid">
            {/* 열 힌트 */}
            <div className="top-hints">
              <div className="empty-corner" />
              {colHints.map((col, colIndex) => (
                <div key={colIndex} className="col-hint">
                  {col.map((num, idx) => (
                    <div key={idx}>{num}</div>
                  ))}
                </div>
              ))}
            </div>

            <div className="main-area">
              {/* 행 힌트 */}
              <div className="row-hints">
                {rowHints.map((row, rowIndex) => (
                  <div key={rowIndex} className="row-hint">
                    {row.map((num, idx) => (
                      <div key={idx}>{num}</div>
                    ))}
                  </div>
                ))}
              </div>

              {/* 퍼즐 그리드 */}
              <div className="grid">
                {userGrid.map((row, rowIndex) => (
                  <div className="grid-row" key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <div
                        className={`grid-cell ${cell ? "clicked" : ""}`}
                        key={colIndex}
                        onClick={() => toggleCell(rowIndex, colIndex)}
                      />
                    ))}
                  </div>
                ))}
              </div>
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
