import React from 'react';
import { useParams } from 'react-router-dom';
import App from '../App';

export default function AppContainer() {
  const { semesterId } = useParams();

  return (
    <App
      semesterId={semesterId}
    />
  );
}
