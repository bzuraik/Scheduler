import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchSection from '../components/SearchSection';

export default function SearchSectionContainer({ semesterId }) {
  const [disableAddSection, setDisableAddSection] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputCourse, setInputCourse] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [returnedCourseDataJSON, setReturnedCourseDataJSON] = useState('');
  const [sectionsToDisplay, setSectionsToDisplay] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');

  const openModal = useCallback(() => {
    setIsOpen(true);
  });

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSectionsToDisplay([]);
    setSelectedSection('');
    setErrorMessage('');
  });

  const onSearchCourse = useCallback((e) => {
    setInputCourse(e.target.value);
  });

  const onSubmitCourse = useCallback(() => {
    fetch(`/api/sections?semester=${semesterId}&course=${inputCourse}`)
      .then((res) => res.json())
      .then((responseJSON) => {
        setReturnedCourseDataJSON(JSON.stringify(responseJSON));
      });
  });

  const selectOption = useCallback((selectedOption) => {
    if (selectedSection === selectedOption) {
      setSelectedSection('');
    } else {
      setSelectedSection(selectedOption);
    }
  });

  useEffect(() => {
    if (returnedCourseDataJSON === '') {
      return;
    }
    const parsedJSON = JSON.parse(returnedCourseDataJSON);
    if (parsedJSON.error_msg !== '') {
      setSectionsToDisplay([]);
      setSelectedSection('');
      setErrorMessage(parsedJSON.error_msg);
      return;
    }
    setSectionsToDisplay([]);
    setSelectedSection('');
    setErrorMessage('');
    const sections = [];
    parsedJSON.sections.forEach((section) => {
      const sectionObj = {};
      sectionObj.section_name = parsedJSON.course.concat('*', section.section_name);
      const meetingTypes = Object.keys(section.section_data);
      const sectionData = [];
      meetingTypes.forEach((meeting) => {
        if (meeting === 'conflicts') {
          return;
        }
        const meetingObj = {};
        if (meeting === 'DE Meetings') {
          meetingObj.type = 'DE';
          meetingObj.times = 'No timings available';
          meetingObj.message = 'Asynchronous';
        } else {
          meetingObj.type = meeting;
          meetingObj.times = section.section_data[meeting].start_time.concat(' - ', section.section_data[meeting].end_time);
          meetingObj.days = section.section_data[meeting].days;
        }
        sectionData.push(meetingObj);
      });
      if (meetingTypes.indexOf('EXAM') === -1) {
        let meetingObj = {};
        meetingObj.type = 'EXAM';
        meetingObj = { ...meetingObj, times: 'N/A', date: '' };
        sectionData.push(meetingObj);
      }
      sectionObj.section_data = sectionData;
      sections.push(sectionObj);
    });
    setSectionsToDisplay(sections);
  }, [returnedCourseDataJSON]);

  useEffect(() => {
    if (selectedSection !== '') {
      setDisableAddSection(false);
    } else {
      setDisableAddSection(true);
    }
  }, [selectedSection]);

  const onAddSection = useCallback(() => {
    for (let i = 1; i < 6; i++) {
      const el = document.getElementById(i);
      if (!el.value) {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, selectedSection);
        el.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
    closeModal();
  });
  return (
    <SearchSection
      closeModal={closeModal}
      disableAddSection={disableAddSection}
      errorMessage={errorMessage}
      modalIsOpen={modalIsOpen}
      onSearchCourse={onSearchCourse}
      onSubmitCourse={onSubmitCourse}
      openModal={openModal}
      sectionsToDisplay={sectionsToDisplay}
      selectOption={selectOption}
      selectedSection={selectedSection}
      onAddSection={onAddSection}
    />
  );
}

SearchSectionContainer.propTypes = {
  semesterId: PropTypes.string.isRequired,
};
