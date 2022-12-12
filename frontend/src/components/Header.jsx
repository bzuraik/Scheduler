import React from 'react';
import logo from '../assets/logo.png';

const styles = {
  container: {
    margin: '0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 'calc(10px + 1vmin)',
  },
  logo: {
    display: 'inline-block',
    height: 'calc(10px + 7vmin)',
    width: 'calc(10px + 7vmin)',
    margin: '5px 10px 5px 40px',
    marginRight: '10px',
  },
  schedulePlanner: {
    margin: '0',
  },
};

export default function Header() {
  return (
    <header style={styles.container}>
      <img src={logo} style={styles.logo} alt="sloth logo" />
      <h1 style={styles.schedulePlanner}>Schedule Planner</h1>
    </header>
  );
}
