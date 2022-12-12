import React from 'react';
import PropTypes from 'prop-types';

export default function ErrorCard({
  errorString,
}) {
  return (
    <div className="error-course">
      <strong>Error!</strong>
      {' '}
      {errorString}
    </div>
  );
}

ErrorCard.propTypes = {
  errorString: PropTypes.string.isRequired,
};
