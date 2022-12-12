import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';

export default function CourseInput({
  id,
  value,
  backgroundColor,
  onChange,
  hasConflict,
}) {
  return (
    <TextInput
      id={id}
      value={value}
      backgroundColor={backgroundColor}
      onChange={onChange}
      borderColor={hasConflict ? '#f44336' : 'white'}
    />
  );
}

CourseInput.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.string,
  backgroundColor: PropTypes.string,
  onChange: PropTypes.func,
  hasConflict: PropTypes.bool,
};

CourseInput.defaultProps = {
  value: '',
  backgroundColor: '#E9E9E9',
  onChange: null,
  hasConflict: false,
};
