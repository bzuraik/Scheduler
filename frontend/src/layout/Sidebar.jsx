import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    width: '350px',
    marginLeft: '60px',
    marginBottom: '12px',
  },
};

export default function Sidebar({ children }) {
  return (
    <div style={styles.sidebar}>
      { children }
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.element.isRequired,
};
