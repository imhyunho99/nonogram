// src/pages/Game.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';
import './Game.css';

const Game = () => {
  const { id } = useParams();  // origin image id
  const [searchParams] = useSearchParams();  // get ?grid=30
  const [gridData, setGridData] = useState([]);
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
      } catch (error) {
        console.error("Error fetching puzzle data:", error);
      }
    };

    if (id && size) {
      fetchData();
    }
  }, [id, size]);

  return (
    <div className="game-container">
      {gridData.length > 0 ? (
        <div className="grid">
          {gridData.map((row, rowIndex) => (
            <div className="grid-row" key={rowIndex}>
              {row.map((cell, colIndex) => (
                <div
                  className={`grid-cell ${cell ? "filled" : ""}`}
                  key={colIndex}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading puzzle...</p>
      )}
    </div>
  );
};

export default Game;
