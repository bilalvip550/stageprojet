import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function History() {
  const { id } = useParams();
  
  return (
    <div className="history-page">
      <h2>Task History {id}</h2>
      <p>Task history data would be displayed here.</p>
      <Link to="/app/Detail" className="back-button">Back to Detail</Link>

      <style>
        {`
          .history-page {
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          }

          .history-page h2 {
            color: #2c3e50;
            margin-bottom: 1.5rem;
            font-size: 2rem;
          }

          .history-page p {
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .back-button {
            display: inline-block;
            padding: 0.8rem 1.5rem;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
            font-size: 1rem;
            border: none;
            cursor: pointer;
          }

          .back-button:hover {
            background-color: #2980b9;
          }

          .back-button:active {
            transform: scale(0.98);
          }
        `}
      </style>
    </div>
  );
}