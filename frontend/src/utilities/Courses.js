// update the array of input courses so all names are displayed in a consistent way
// (i.e. COURSE*SECTION)
export function formatEnteredCourses(enteredCoursesCopy) {
  const newNamesArray = [];

  const courseCodeRegex = /^([A-Z]{3,4})([0-9]{4})/g; // regex pattern for getting the course code
  const sectionRegex = /^[A-Z]{3,4}[0-9]{4}((.*))/; // regex pattern for getting the section number

  enteredCoursesCopy.forEach((course) => {
    // update the name only if it does not contain a "*" already and
    // if the course name is not empty
    if (course !== '' && typeof course !== 'undefined' && !course.includes('*')) {
      const upperCaseName = course.toUpperCase();

      let courseCode;
      let section;
      let regexResult = [];

      let matchFound = true;

      // extract course code
      if (courseCodeRegex.test(upperCaseName)) {
        regexResult = upperCaseName.match(courseCodeRegex);
        courseCode = regexResult[0];
      } else {
        matchFound = false;
      }

      // extract section
      if (sectionRegex.test(upperCaseName)) {
        regexResult = upperCaseName.match(sectionRegex);
        section = regexResult[1];
      } else {
        matchFound = false;
      }

      // only change the name if we were able to parse out the course name and section
      if (matchFound) newNamesArray.push(`${courseCode}*${section}`);
      else newNamesArray.push(upperCaseName);

    // otherwise, just convert the given name to all uppercase
    } else if (typeof course !== 'undefined') {
      newNamesArray.push(course.toUpperCase());
    }
  });

  return newNamesArray;
}

export function generateCourseString(enteredCourses) {
  let courseString = '';
  let courseId = 1;

  for (let courseIndex = 0; enteredCourses[courseIndex]; courseIndex++) {
    courseString += `&course${courseId}=${enteredCourses[courseIndex]}`;
    courseId += 1;
  }

  return courseString;
}

export function removeCourses(coursesToRemove, courses) {
  const newCourses = [...courses];

  coursesToRemove.forEach((courseCode) => {
    newCourses[newCourses.indexOf(courseCode)] = '';
  });

  return newCourses;
}

export function orderCourses(courseArr) {
  return courseArr.sort((a) => (a !== '' ? -1 : 1));
}

export function sortDays(day1, day2) {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  return days.indexOf(day1) - days.indexOf(day2);
}

export function createErrorString(invalidCourseCodes) {
  let errorString = 'The following courses do not exist: ';
  let i = 0;

  invalidCourseCodes.forEach((courseCode) => {
    if (i !== 0) {
      errorString = errorString.concat(', ');
    }
    errorString = errorString.concat(`${courseCode}`);
    i += 1;
  });

  return errorString;
}

export function getEnteredCourseConflicts(fetchedCourseData, orderedCourses = null) {
  const courseIdHasConflicts = [false, false, false, false, false];

  Object.values(fetchedCourseData).forEach((course, index) => {
    if (course.conflicts.length > 0) {
      const courseName = Object.keys(fetchedCourseData).find(
        (key) => fetchedCourseData[key] === course,
      );

      /* use position of course name in sorted array as index (if suggestions were used)
         to ensure conflict styling gets added to the correct input pills */
      if (orderCourses !== null) courseIdHasConflicts[orderedCourses.indexOf(courseName)] = true;
      else courseIdHasConflicts[index] = true;
    }
  });

  return courseIdHasConflicts;
}

export function mergeCourses(courses1, courses2) {
  const newCourses = ['', '', '', '', ''];

  courses1.concat(courses2).forEach((course, courseIndex) => {
    newCourses[courseIndex] = course;
  });

  return newCourses;
}
