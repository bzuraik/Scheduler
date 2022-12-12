import React from 'react';
import PropTypes from 'prop-types';
import WeeklyCalendar from './calendars/WeeklyCalendar';
import MonthlyCalendar from './calendars/MonthlyCalendar';
import Sidebar from '../layout/Sidebar';
import Section from '../layout/Section/Section';
import { SCHEDULE_TYPES } from '../constants/semester';
import '../App.css';
import CourseInput from './CourseInput';
import SectionRow from '../layout/Section/SectionRow';
import SectionColumn from '../layout/Section/SectionColumn';
import SemesterSwitcherContainer from '../containers/SemesterSwitcherContainer';
import SearchSectionContainer from '../containers/SearchSectionContainer';
import ErrorCard from './ErrorCard';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  calendarSection: {
    padding: '0 5%',
  },
  calendarOptionsRow: {
    padding: '20px 0',
  },
  hide: {
    display: 'none',
  },
  courseInputs: {
    flexFlow: 'row wrap',
  },
};

export default function Semester({
  hide,
  enteredCourses,
  enteredCourseConflicts,
  errorString,
  courseInputColors,
  disableAdd,
  disableDaysSelect,
  disableAddSuggestion,
  calendarToShow,
  calendarData,
  examCalendarData,
  selectedDays,
  selectedSuggestion,
  semesterId,
  onSemesterSwitch,
  onToggleSchedule,
  onAddCourse,
  onRemoveAllCourses,
  onSelectDay,
  onSelectSuggestion,
  onSubmitCourses,
  onAddSuggestions,
  onClearSuggestions,
}) {
  return (
    <div style={hide
      ? { ...styles.container, ...styles.hide }
      : styles.container}
    >
      <Sidebar>
        <Section>
          <div id="courseSectionHeader">
            <h2>Courses</h2>
            <SearchSectionContainer semesterId={semesterId} />
          </div>
          <div style={styles.courseInputs}>
            {errorString !== ''
              ? <ErrorCard errorString={errorString} />
              : null}
            {enteredCourses.map((_, courseIndex) => (
              <CourseInput
                id={courseIndex + 1}
                value={enteredCourses[courseIndex]}
                backgroundColor={courseInputColors[courseIndex]}
                onChange={onAddCourse}
                hasConflict={enteredCourseConflicts[courseIndex]}
              />
            ))}
          </div>
          <button type="button" id="addCoursesBtn" disabled={disableAdd} onClick={onSubmitCourses}>Add To Schedule</button>
          <button type="button" id="clearCoursesBtn" disabled={disableAdd} onClick={onRemoveAllCourses}>Clear Schedule</button>
        </Section>
        <Section title="Suggestions">
          <div id="suggestionOptions" onChange={onSelectSuggestion}>
            {['Default', 'No Exams', 'Early Schedule', 'Late Schedule', 'Include days', 'Exclude days'].map((e) => (
              <div className="suggestionOptions" key={e}>
                <input type="radio" id={e} value={e} name={`suggestion${semesterId}`} checked={selectedSuggestion === e} />
                <label htmlFor={e}>{e}</label>
              </div>
            ))}
          </div>
          <div id="daysSelect" onChange={onSelectDay}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((e) => (
              <div className="daysOption" key={e}>
                <input type="checkbox" id={`${semesterId}_${e}`} value={e} disabled={disableDaysSelect} checked={selectedDays.includes(e)} />
                <label htmlFor={`${semesterId}_${e}`}>{e.slice(0, 3).toUpperCase()}</label>
              </div>
            ))}
          </div>
          <button type="button" id="addSuggestionsBtn" disabled={disableAddSuggestion} onClick={onAddSuggestions}>Add Suggestions</button>
          <button type="button" id="clearSuggestionsBtn" disabled={disableAddSuggestion} onClick={onClearSuggestions}>Clear Suggestions</button>
        </Section>
      </Sidebar>
      <Section style={styles.calendarSection}>
        <SectionRow
          justifyContent="flex-end"
          style={styles.calendarOptionsRow}
        >
          <SectionColumn>
            <SemesterSwitcherContainer
              onSwitch={(switchType) => onSemesterSwitch(switchType)}
              currentSemesterId={semesterId}
            />
          </SectionColumn>
          <SectionColumn alignItems="flex-end">
            <label className="calendarToggleBtn">
              <input type="checkbox" name={`calendarToggle_${semesterId}`} id={`calendarToggle_${semesterId}`} value="1" onChange={onToggleSchedule} />
              <label htmlFor={`calendarToggle_${semesterId}`} className="calendarToggleBtnInner" />
            </label>
          </SectionColumn>
        </SectionRow>
        <SectionRow>
          {calendarToShow === SCHEDULE_TYPES.CLASSES
            ? <WeeklyCalendar calendarEvents={calendarData} />
            : <MonthlyCalendar calendarEvents={examCalendarData} />}
        </SectionRow>
      </Section>
    </div>
  );
}

Semester.propTypes = {
  hide: PropTypes.bool.isRequired,
  errorString: PropTypes.string.isRequired,
  enteredCourses: PropTypes.arrayOf(PropTypes.string).isRequired,
  enteredCourseConflicts: PropTypes.arrayOf(PropTypes.bool).isRequired,
  courseInputColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  disableAdd: PropTypes.bool.isRequired,
  disableDaysSelect: PropTypes.bool.isRequired,
  disableAddSuggestion: PropTypes.bool.isRequired,
  calendarToShow: PropTypes.string.isRequired,
  calendarData: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.shape({
        ticks: PropTypes.number,
        value: PropTypes.string,
      }).isRequired,
      end: PropTypes.shape({
        ticks: PropTypes.number,
        value: PropTypes.string,
      }).isRequired,
      backColor: PropTypes.string.isRequired,
      barHidden: PropTypes.bool.isRequired,
      borderColor: PropTypes.string.isRequired,
    }),
  ).isRequired,
  examCalendarData: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.shape({
        ticks: PropTypes.number,
        value: PropTypes.string,
      }).isRequired,
      end: PropTypes.shape({
        ticks: PropTypes.number,
        value: PropTypes.string,
      }).isRequired,
      backColor: PropTypes.string.isRequired,
      barHidden: PropTypes.bool.isRequired,
      borderColor: PropTypes.string.isRequired,
      day: PropTypes.string,
      id: PropTypes.number.isRequired,
      toolTip: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedDays: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSuggestion: PropTypes.string.isRequired,
  semesterId: PropTypes.string.isRequired,
  onSemesterSwitch: PropTypes.func.isRequired,
  onToggleSchedule: PropTypes.func.isRequired,
  onAddCourse: PropTypes.func.isRequired,
  onRemoveAllCourses: PropTypes.func.isRequired,
  onSelectDay: PropTypes.func.isRequired,
  onSelectSuggestion: PropTypes.func.isRequired,
  onSubmitCourses: PropTypes.func.isRequired,
  onAddSuggestions: PropTypes.func.isRequired,
  onClearSuggestions: PropTypes.func.isRequired,
};
