import React from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';
import SemesterContainer from './containers/SemesterContainer';
import { SEMESTER } from './constants/semester';

export default function App({ semesterId }) {
  return (
    <>
      <Header />
      {/* Both SemesterContainers need to be in the DOM at the same time so that their states
        can be maintained (if they rerender/unmount from the DOM, they lose their states). This is
        why the hide attribute has been created.

      TODO: Look into doing some Redux stuff or some state stuff in the AppContainer so that the
        state of both schedules can be maintained. */}
      <SemesterContainer hide={semesterId !== SEMESTER.F22} semesterId={SEMESTER.F22} />
      <SemesterContainer hide={semesterId !== SEMESTER.W23} semesterId={SEMESTER.W23} />
    </>
  );
}

App.propTypes = {
  semesterId: PropTypes.string.isRequired,
};
