import React from 'react';
import PropTypes from 'prop-types';

export default function SectionRow({ children, justifyContent, style }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',

        justifyContent,

        ...style,
      }}
    >
      { children }
    </div>
  );
}

SectionRow.propTypes = {
  children: PropTypes.element.isRequired,
  justifyContent: PropTypes.string,
  style: PropTypes.shape({}),
};

SectionRow.defaultProps = {
  justifyContent: 'flex-start',
  style: {},
};
