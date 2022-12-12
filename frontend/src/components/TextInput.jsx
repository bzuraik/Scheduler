import React from 'react';
import PropTypes from 'prop-types';

export default function TextInput({
  id,
  value,
  backgroundColor,
  onChange,
  borderColor,
}) {
  return (
    <input
      key={id}
      id={id}
      style={{
        backgroundColor: backgroundColor.toString(),
        outline: `2px solid ${borderColor}`,
      }}
      type="text"
      placeholder={`Course ${id}`}
      value={value}
      onChange={(event) => onChange(id, event.target.value)}
    />
  );
}

TextInput.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.string,
  backgroundColor: PropTypes.string,
  onChange: PropTypes.func,
  borderColor: PropTypes.string,
};

TextInput.defaultProps = {
  value: '',
  backgroundColor: '#E9E9E9',
  onChange: null,
  borderColor: 'none',
};
