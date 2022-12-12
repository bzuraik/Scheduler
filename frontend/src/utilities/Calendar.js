import { DayPilot } from '@daypilot/daypilot-lite-react';
import { DEFAULT_COURSE_COLORS } from '../constants/semester';
import { COURSE_COLORS } from '../styles/theme';

function convertTime12to24(time12h, examDate = '') {
  const time = time12h.slice(0, -2);
  const modifier = time12h.slice(-2);

  let hours = time.split(':')[0];
  const minutes = time.split(':')[1];

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  let chosenDate;
  if (examDate !== '') {
    chosenDate = new DayPilot.Date(examDate);
  } else {
    chosenDate = DayPilot.Date.today();
  }
  chosenDate = chosenDate.addHours(hours);
  chosenDate = chosenDate.addMinutes(minutes);

  return chosenDate;
}

function addDefaultInformationToEvent(calendarEvent, meeting, meetingType, courseIndex) {
  const meetingDate = meetingType === 'EXAM' ? meeting.date : undefined;

  return {
    ...calendarEvent,
    start: convertTime12to24(meeting.start_time, meetingDate),
    end: convertTime12to24(meeting.end_time, meetingDate),
    backColor: COURSE_COLORS[courseIndex],
    barHidden: true,
    borderColor: 'rgba(0, 0, 0, 0)',
    id: courseIndex,
  };
}

function addNonExamInformationToEvent(calendarEvent, eventDay, courseCode, meetingType) {
  return {
    ...calendarEvent,
    resource: eventDay,
    text: `${courseCode}\n${meetingType}`,
  };
}

function addExamInformationToEvent(calendarEvent, eventId, courseCode, meeting) {
  return {
    ...calendarEvent,
    id: eventId,
    text: courseCode,
    toolTip: `${courseCode}\n${meeting.start_time} - ${meeting.end_time}`,
  };
}

export function getCalendarEvents(fetchedCourseData) {
  const courseCodes = Object.keys(fetchedCourseData);
  const classScheduleEvents = [];
  const examScheduleEvents = [];

  courseCodes.forEach((courseCode, index) => {
    const courseMeetings = Object.keys(fetchedCourseData[courseCode]).filter((key) => key !== 'conflicts');
    courseMeetings.forEach((meetingType) => {
      const meetingDays = fetchedCourseData[courseCode][meetingType].days;
      meetingDays.forEach((day) => {
        let calendarEvent = {};
        const meeting = fetchedCourseData[courseCode][meetingType];

        calendarEvent = addDefaultInformationToEvent(calendarEvent, meeting, meetingType, index);

        // Add conflicts to calendar events
        const conflicts = fetchedCourseData[courseCode].conflicts;
        if (conflicts.length > 0) {
          const currMeeting = [fetchedCourseData[courseCode][meetingType].start_time,
            fetchedCourseData[courseCode][meetingType].end_time, day];
          if (conflicts.some((time) => currMeeting.every((v, i) => v === time[i]))) {
            calendarEvent.cssClass = 'conflict';
          }
        }

        if (meetingType === 'EXAM') {
          calendarEvent = addExamInformationToEvent(calendarEvent, index, courseCode, meeting);
          examScheduleEvents.push(calendarEvent);
        } else {
          calendarEvent = addNonExamInformationToEvent(calendarEvent, day, courseCode, meetingType);
          classScheduleEvents.push(calendarEvent);
        }
      });
    });
  });

  return {
    classScheduleEvents,
    examScheduleEvents,
  };
}

export function getCourseColors(fetchedCourseData, handleConflicts = true) {
  const newCourseInputColors = [...DEFAULT_COURSE_COLORS];

  const courseCodes = handleConflicts ? Object.keys(fetchedCourseData) : fetchedCourseData;
  courseCodes.forEach((course, index) => {
    if (course === '') {
      return;
    }
    newCourseInputColors[index] = COURSE_COLORS[index];

    if (handleConflicts) {
      // add red border if course has conflicts
      if (fetchedCourseData[course].conflicts.length > 0) {
        const inputBtn = document.getElementById(index + 1);
        inputBtn.setAttribute('class', 'conflict');
      }
    }
  });
  return newCourseInputColors;
}
