import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Semester from '../components/Semester';
import {
  SCHEDULE_TYPES,
  DEFAULT_COURSE_COLORS,
  SEMESTER_TRANSITIONS,
  SEMESTER,
} from '../constants/semester';
import * as CalendarUtil from '../utilities/Calendar';
import * as CoursesUtil from '../utilities/Courses';

export default function SemesterContainer({ hide, semesterId }) {
  const [enteredCourses, setEnteredCourses] = useState(['', '', '', '', '']);
  const [enteredCourseConflicts, setEnteredCourseConflicts] = useState(
    [false, false, false, false, false],
  );
  const [courseInputColors, setCourseInputColors] = useState(DEFAULT_COURSE_COLORS);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [disableAdd, setDisableAdd] = useState(true);
  const [disableDaysSelect, setDisableDaysSelect] = useState(true);
  const [disableAddSuggestion, setDisableAddSuggestion] = useState(true);
  const [returnedCourseDataJSON, setReturnedCourseDataJSON] = useState('');
  const [calendarData, setCalendarData] = useState([]);
  const [examCalendarData, setExamCalendarData] = useState([]);
  const [calendarToShow, setCalendarToShow] = useState(SCHEDULE_TYPES.CLASSES);
  const [errorString, setErrorCard] = useState('');

  const navigate = useNavigate();

  const onAddCourse = useCallback((courseId, course) => {
    const enteredCoursesCopy = [...enteredCourses];
    enteredCoursesCopy[courseId - 1] = course;
    setEnteredCourses(enteredCoursesCopy);
  });

  const onToggleSchedule = useCallback(() => {
    if (calendarToShow === SCHEDULE_TYPES.CLASSES) {
      setCalendarToShow(SCHEDULE_TYPES.EXAMS);
    } else if (calendarToShow === SCHEDULE_TYPES.EXAMS) {
      setCalendarToShow(SCHEDULE_TYPES.CLASSES);
    }
  });

  const onRemoveAllCourses = useCallback(() => {
    const newEnteredCourses = Object.keys([...enteredCourses]).map(() => '');

    setEnteredCourses(newEnteredCourses);
    setReturnedCourseDataJSON('');
    setCalendarData([]);
    setExamCalendarData([]);
    setCourseInputColors(DEFAULT_COURSE_COLORS);
    setEnteredCourseConflicts([false, false, false, false, false]);
    setErrorCard('');
  });

  const onSelectDay = useCallback((e) => {
    const selectedDaysCopy = [...selectedDays];
    if (e.target.checked === true) {
      selectedDaysCopy.push(e.target.value);
    } else {
      const indexOfDay = selectedDaysCopy.indexOf(e.target.value);
      selectedDaysCopy.splice(indexOfDay, 1);
    }
    setSelectedDays(selectedDaysCopy.sort(CoursesUtil.sortDays));
  });

  const onSelectSuggestion = useCallback((e) => {
    setSelectedSuggestion(e.target.value);
    setDisableAddSuggestion(false);
  });

  const onClearSuggestions = useCallback(() => {
    setSelectedSuggestion('');
    setSelectedDays([]);
    setDisableAddSuggestion(true);
  });

  const onSubmitCourses = useCallback(() => {
    const formattedEnteredCourses = CoursesUtil.formatEnteredCourses([...enteredCourses]);
    setEnteredCourses(CoursesUtil.orderCourses(formattedEnteredCourses));

    const numCourses = formattedEnteredCourses.filter((course) => course !== '').length;
    const courseString = CoursesUtil.generateCourseString(formattedEnteredCourses);

    fetch(`/api/search?numCourses=${numCourses}${courseString}&semester=${semesterId}`)
      .then((res) => res.json())
      .then((responseJSON) => {
        if (responseJSON.errors.length > 0) {
          const invalidCourses = responseJSON.errors;

          setErrorCard(CoursesUtil.createErrorString(invalidCourses));
          setEnteredCourses(CoursesUtil.orderCourses(
            CoursesUtil.removeCourses(invalidCourses, formattedEnteredCourses),
          ));
        } else {
          setErrorCard('');
        }
        setReturnedCourseDataJSON(JSON.stringify(responseJSON));
      });
  });

  const onAddSuggestions = useCallback(() => {
    const formattedEnteredCourses = CoursesUtil.formatEnteredCourses([...enteredCourses]);
    setEnteredCourses(CoursesUtil.orderCourses(formattedEnteredCourses));

    const numCourses = enteredCourses.filter((course) => course !== '').length;
    const courseString = CoursesUtil.generateCourseString(formattedEnteredCourses);

    fetch(`/api/suggestions?numCourses=${numCourses}${courseString}&semester=${semesterId}&type=${selectedSuggestion.toLowerCase().replace(/ /g, '-')}&days=${selectedDays.join('%20')}`)
      .then((res) => res.json())
      .then((responseJSON) => {
        if (responseJSON.errors.length > 0) {
          const invalidCourses = responseJSON.errors;

          setErrorCard(CoursesUtil.createErrorString(invalidCourses));
          setEnteredCourses(CoursesUtil.orderCourses(
            CoursesUtil.mergeCourses(
              [],
              Object.keys(responseJSON.data),
            ),
          ));
        } else if (Object.keys(responseJSON.data).length < 5) {
          setErrorCard('Could not find 5 courses with current combination of entered courses and suggestion options.');
          setEnteredCourses(CoursesUtil.orderCourses(
            CoursesUtil.formatEnteredCourses(
              CoursesUtil.mergeCourses([], Object.keys(responseJSON.data)),
            ),
          ));
        } else {
          setErrorCard(''); // Clears the error card.
          setEnteredCourses(CoursesUtil.orderCourses(
            CoursesUtil.formatEnteredCourses(Object.keys(responseJSON.data)),
          ));
        }
        setReturnedCourseDataJSON(JSON.stringify(responseJSON));
      });
  });

  const onSemesterSwitch = useCallback((backwardOrForward) => {
    const semesters = Object.keys(SEMESTER);
    const currentSemesterIndex = semesters.indexOf(semesterId);

    if (backwardOrForward === SEMESTER_TRANSITIONS.FORWARD) {
      navigate(`/semester/${semesters[currentSemesterIndex + 1]}`);
    } else if (backwardOrForward === SEMESTER_TRANSITIONS.BACK) {
      navigate(`/semester/${semesters[currentSemesterIndex - 1]}`);
    }
  });

  useEffect(() => {
    const isCourseInputEmpty = Object.keys(enteredCourses)
      .find((courseIndex) => enteredCourses[courseIndex] !== '');

    if (isCourseInputEmpty) {
      setDisableAdd(false);
    } else {
      setDisableAdd(true);
    }
  }, [enteredCourses]);

  useEffect(() => {
    if (selectedSuggestion === 'Include days' || selectedSuggestion === 'Exclude days') {
      setDisableDaysSelect(false);
    } else {
      setDisableDaysSelect(true);
    }
  }, [selectedSuggestion]);

  useEffect(() => {
    if (returnedCourseDataJSON) {
      const fetchedCourseData = JSON.parse(returnedCourseDataJSON).data;

      let newCalendarEvents;
      if (selectedSuggestion !== '') {
        const orderedSuggestionData = CoursesUtil.orderCourses(Object.keys(fetchedCourseData))
          .reduce(
            (obj, key) => {
              const objCopy = { ...obj };
              objCopy[key] = fetchedCourseData[key];
              return objCopy;
            },
            {},
          );

        newCalendarEvents = CalendarUtil.getCalendarEvents(orderedSuggestionData);

        setEnteredCourseConflicts(CoursesUtil
          .getEnteredCourseConflicts(fetchedCourseData, enteredCourses, orderedSuggestionData));
      } else {
        newCalendarEvents = CalendarUtil.getCalendarEvents(fetchedCourseData);
      }

      setCalendarData(newCalendarEvents.classScheduleEvents);
      setExamCalendarData(newCalendarEvents.examScheduleEvents);

      if (selectedSuggestion !== '') {
        setCourseInputColors(CalendarUtil.getCourseColors(enteredCourses, false));
      } else {
        setCourseInputColors(CalendarUtil.getCourseColors(fetchedCourseData));
        setEnteredCourseConflicts(CoursesUtil
          .getEnteredCourseConflicts(fetchedCourseData, enteredCourses));
      }
    }
  }, [returnedCourseDataJSON]);

  return (
    <Semester
      hide={hide}
      enteredCourses={enteredCourses}
      enteredCourseConflicts={enteredCourseConflicts}
      errorString={errorString}
      courseInputColors={courseInputColors}
      disableAdd={disableAdd}
      disableDaysSelect={disableDaysSelect}
      disableAddSuggestion={disableAddSuggestion}
      calendarToShow={calendarToShow}
      calendarData={calendarData}
      examCalendarData={examCalendarData}
      selectedDays={selectedDays}
      selectedSuggestion={selectedSuggestion}
      semesterId={semesterId}
      onSemesterSwitch={onSemesterSwitch}
      onToggleSchedule={onToggleSchedule}
      onAddCourse={onAddCourse}
      onRemoveAllCourses={onRemoveAllCourses}
      onSelectDay={onSelectDay}
      onSelectSuggestion={onSelectSuggestion}
      onSubmitCourses={onSubmitCourses}
      onAddSuggestions={onAddSuggestions}
      onClearSuggestions={onClearSuggestions}
    />
  );
}

SemesterContainer.propTypes = {
  semesterId: PropTypes.string.isRequired,
  hide: PropTypes.bool.isRequired,
};
