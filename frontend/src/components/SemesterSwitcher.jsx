import React from 'react';
import PropTypes from 'prop-types';
import { SEMESTER_TRANSITIONS, SEMESTER_TRANSLATION } from '../constants/semester';
import backButton from '../assets/back_button.svg';
import backButtonDisabled from '../assets/back_button_disabled.svg';
import forwardButton from '../assets/forward_button.svg';
import forwardButtonDisabled from '../assets/forward_button_disabled.svg';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  image: {
    height: '36px',
    stroke: 'purple',
    fill: 'blue',
    verticalAlign: 'middle',
  },
  semesterText: {
    fontWeight: 'bold',
    fontSize: '24px',
    margin: '0 0 0 10px',
  },
};

export default function SemesterSwitcher({
  onSwitch,
  currentSemesterId,
  backDisabled,
  forwardDisabled,
}) {
  return (
    <div style={styles.container}>
      <label>
        <button
          type="button"
          name="back"
          disabled={backDisabled}
          onClick={() => onSwitch(SEMESTER_TRANSITIONS.BACK)}
        >
          <img
            style={styles.image}
            src={backDisabled
              ? backButtonDisabled
              : backButton}
            alt="semester back"
          />
        </button>
        <button
          type="button"
          name="forward"
          aria-label="semester forward"
          disabled={forwardDisabled}
          onClick={() => onSwitch(SEMESTER_TRANSITIONS.FORWARD)}
        >
          <img
            style={styles.image}
            src={forwardDisabled
              ? forwardButtonDisabled
              : forwardButton}
            alt="semester forward"
          />
        </button>
      </label>
      <p style={styles.semesterText}>
        { SEMESTER_TRANSLATION[currentSemesterId] }
      </p>
    </div>
  );
}

SemesterSwitcher.propTypes = {
  onSwitch: PropTypes.func.isRequired,
  currentSemesterId: PropTypes.func.isRequired,
  backDisabled: PropTypes.bool.isRequired,
  forwardDisabled: PropTypes.bool.isRequired,
};
