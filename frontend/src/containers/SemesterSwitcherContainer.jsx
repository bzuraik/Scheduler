import React from 'react';
import PropTypes from 'prop-types';
import { SEMESTER } from '../constants/semester';
import SemesterSwitcher from '../components/SemesterSwitcher';

export default function SemesterSwitcherContainer({
  currentSemesterId,
  onSwitch,
}) {
  const forwardDisabled = Object.keys(SEMESTER)
    .indexOf(currentSemesterId) === Object.keys(SEMESTER).length - 1;

  const backDisabled = Object.keys(SEMESTER)
    .indexOf(currentSemesterId) === 0;

  return (
    <SemesterSwitcher
      currentSemesterId={currentSemesterId}
      backDisabled={backDisabled}
      forwardDisabled={forwardDisabled}
      onSwitch={onSwitch}
    />
  );
}

SemesterSwitcherContainer.propTypes = {
  currentSemesterId: PropTypes.string.isRequired,
  onSwitch: PropTypes.func.isRequired,
};
