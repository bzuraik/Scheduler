import React from 'react';
import PropTypes from 'prop-types';

export default function SectionColumn({ children, alignItems }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',

        alignItems,
      }}
    >
      { children }
    </div>
  );
}

SectionColumn.propTypes = {
  children: PropTypes.element.isRequired,
  alignItems: PropTypes.string,
};

SectionColumn.defaultProps = {
  alignItems: 'flex-start',
};
