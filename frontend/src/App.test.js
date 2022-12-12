import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

test('Test Fall Page', () => {
  render(<MemoryRouter><App semesterId="F22" /></MemoryRouter>); // testing if the page renders correctly
  const img = screen.getByAltText('sloth logo'); // testing if the logos is displayed
  const buttonAddCourse = screen.getByRole('button', { name: /Add To Schedule/i }); // testing if the add courses button is render and disabled upon loading
  const buttonClearCourse = screen.getByRole('button', { name: /Clear Schedule/i }); // testing if the clear courses button is render and disabled upon loading
  const buttonAddSuggestion = screen.getByRole('button', { name: /Add Suggestions/i }); // testing if the add suggestions button is render and disabled upon loading
  const buttonClearSuggestion = screen.getByRole('button', { name: /Clear Suggestions/i }); // testing if the clear suggestions button is render and disabled upon loading

  expect(buttonAddCourse).toBeDisabled();
  expect(buttonClearCourse).toBeDisabled();
  expect(buttonAddSuggestion).toBeDisabled();
  expect(buttonClearSuggestion).toBeDisabled();
  expect(img).toBeInTheDocument();
});

test('Test Winter Page', () => {
  render(<MemoryRouter><App semesterId="W23" /></MemoryRouter>); // testing if the page renders correctly
  const img = screen.getByAltText('sloth logo'); // testing if the logos is displayed
  const buttonAddCourse = screen.getByRole('button', { name: /Add To Schedule/i }); // testing if the add courses button is render and disabled upon loading
  const buttonClearCourse = screen.getByRole('button', { name: /Clear Schedule/i }); // testing if the clear courses button is render and disabled upon loading
  const buttonAddSuggestion = screen.getByRole('button', { name: /Add Suggestions/i }); // testing if the add suggestions button is render and disabled upon loading
  const buttonClearSuggestion = screen.getByRole('button', { name: /Clear Suggestions/i }); // testing if the clear suggestions button is render and disabled upon loading

  expect(buttonAddCourse).toBeDisabled();
  expect(buttonClearCourse).toBeDisabled();
  expect(buttonAddSuggestion).toBeDisabled();
  expect(buttonClearSuggestion).toBeDisabled();
  expect(img).toBeInTheDocument();
});
