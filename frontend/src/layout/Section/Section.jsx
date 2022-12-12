import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },
};

export default function Section({ title, children, style }) {
  return (
    <div style={{ ...styles.container, ...style }}>
      {title
        ? <h2>{title}</h2>
        : null}
      {children}
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element.isRequired,
  style: PropTypes.shape({}),
};

Section.defaultProps = {
  title: '',
  style: {},
};
