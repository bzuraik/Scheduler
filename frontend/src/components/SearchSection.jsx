import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const styles = {
  root: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      width: '1200px',
      height: '650px',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      overflow: 'hidden',
    },
  },
  btn: {
    top: '50%',
    left: '50%',
    display: 'inline-block',
    fontSize: '30px',
    color: '#858585',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBody: {
    margin: '60px',
    marginTop: '20px',
    padding: '20px',
    overflowY: 'auto',
    height: '70%',
  },
};

export default function SearchSection({
  closeModal,
  disableAddSection,
  errorMessage,
  modalIsOpen,
  onSubmitCourse,
  onSearchCourse,
  openModal,
  sectionsToDisplay,
  selectOption,
  selectedSection,
  onAddSection,
}) {
  return (
    <div>
      <button type="button" onClick={openModal} id="openModalBtn" aria-label="+" />
      <Modal
        isOpen={modalIsOpen}
        style={styles.root}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        <div id="modalHeader" style={styles.modalHeader}>
          <div id="searchBar">
            <input type="text" placeholder="Search courses" onChange={onSearchCourse} onKeyDown={(event) => { if (event.key === 'Enter') onSubmitCourse(event); }} />
            <button type="button" onClick={onSubmitCourse}>Search</button>
          </div>
          <button type="button" onClick={closeModal} style={styles.btn}>&#x2715;</button>
        </div>
        <div id="modalBody" style={styles.modalBody}>
          {sectionsToDisplay.length > 0 ? sectionsToDisplay.map((section, index) => (
            <div role="option" tabIndex={index} aria-selected={section.section_name === selectedSection ? 'true' : 'false'} key={`${section.section_name}`} className={section.section_name === selectedSection ? 'chosenSection section' : 'section'} onClick={() => selectOption(section.section_name)} onKeyDown={() => selectOption(section.section_name)}>
              <div className="sectionName">{section.section_name}</div>
              {section.section_data.map((meeting) => (
                <div className="meeting" key={`${section.section_name}_${meeting}`}>
                  <div>
                    <b>{meeting.type}</b>
&emsp;
                    {meeting.times}
                  </div>
                  <div>
                    <b>{meeting.days ? meeting.days.map((day) => day.slice(0, 3)).join('/') : (meeting.message ?? null)}</b>
&emsp;
                    {meeting.date ?? ''}
                  </div>
                </div>
              ))}
            </div>
          )) : <div className={errorMessage !== '' ? 'modalMessage errorMessage' : 'modalMessage'}>{errorMessage !== '' ? errorMessage : 'Searched Course Sections will appear here'}</div>}
        </div>
        <div id="modalActions">
          <button id="addSectionBtn" type="button" disabled={disableAddSection} onClick={onAddSection}>Add Section</button>
        </div>
      </Modal>
    </div>
  );
}

SearchSection.propTypes = {
  closeModal: PropTypes.func.isRequired,
  disableAddSection: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  onSubmitCourse: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  onSearchCourse: PropTypes.func.isRequired,
  sectionsToDisplay: PropTypes.arrayOf(
    PropTypes.shape({
      section_name: PropTypes.string.isRequired,
      section_data: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          times: PropTypes.string.isRequired,
          days: PropTypes.arrayOf(PropTypes.string),
          message: PropTypes.string,
          date: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  selectOption: PropTypes.func.isRequired,
  selectedSection: PropTypes.string.isRequired,
  onAddSection: PropTypes.func.isRequired,
};
