import json
import string
from .parser import parse_course_name_and_section
from .json import format_section_data, check_for_conflicts, get_section_meeting_times


def get_course_suggestions(course_data: json, user_added_courses: list, options: dict, days: list) -> tuple:
    """This function takes in all course data and a list of course names which have already been chosen
    and suggests more courses with no conflicts with current selection.


    :param course_data: json object with all course data
    :param user_added_courses: list of course names already chosen
    :return: A tuple of the form: (list of course names which includes suggestions + courses already chosen, list of errors)
    """

    meeting_times, course_name_list, errors = _process_user_added_courses(
        course_data, user_added_courses
    )
    course_list = init_course_list(user_added_courses, errors)

    # Find suggestions
    for course in course_data:
        if len(course_list) >= 5:
            break

        if course not in course_name_list:
            sections = course_data[course]["sections"]

            for section in sections:
                # Ignore DE sections
                if "DE" in section or "AU" in section:
                    continue

                section_data = sections[section]
                section_meeting_times = get_section_meeting_times(format_section_data(section_data))
                if not validate_days(section_meeting_times):
                    continue

                # add current section to list of courses to retrieve data for if it meets the right criteria
                conflicts = check_for_conflicts(meeting_times, section_meeting_times)
                hasConflicts = len(conflicts) > 0

                if not hasConflicts and check_filters(options, section_data, days):
                    # default
                    meeting_times.extend(section_meeting_times)
                    course_list.append(course + section)
                    course_name_list.append(course)
                    break

    return (course_list, errors)


def init_course_list(input_courses: list, errors_list: list) -> list:
    """ This function is used to initialize the starting list of courses for the suggestions function

    :param input_courses: a list of courses that the user entered as input
    :param errors_list: a list of course names that are invalid
    :return: A list of initial courses (as needed by the suggestions function)
    """

    course_list = [*input_courses]

    # remove invalid courses from the list if any exist
    if errors_list:
        for invalid_course in errors_list:
            course_list.remove(invalid_course)

    return course_list


def _process_user_added_courses(course_data: json, user_added_courses: list) -> tuple:
    """This is a private function that will be required by all suggestion functions.
    It takes in all course data and a list of course names and returns all meeting times and course names


    :param course_data: json object with all course data
    :param user_added_courses: list of course names already chosen
    :return: A tuple of the format (list_of_meeting_times, list_of_course_names, errors)
    """

    meeting_times = []
    course_name_list = []
    errors = []

    # get the meetings times for user added courses
    for course in user_added_courses:
        name, section = parse_course_name_and_section(course)

        # error occured in parsing or course does not exist (so we skip it)
        if name == "Error" or name not in course_data:
            errors.append(course)
            continue

        section_data = course_data[name]["sections"][section]
        course_meetings = get_section_meeting_times(format_section_data(section_data))
        meeting_times.extend(course_meetings)  # add meetings of current course to list of all meetings
        course_name_list.append(name)  # add name (no section) of course to list of entered courses

    return (meeting_times, course_name_list, errors)


def validate_days(section_meeting_times):
    if section_meeting_times == []:
        return False
    for meeting in section_meeting_times:
        if not meeting[2]:
            return False

    return True


def check_filters(options, section_data, days):

    formatted_section_data = format_section_data(section_data)

    if "early-schedule" in options:
        return check_for_early_or_late(formatted_section_data, "Early")
    elif "late-schedule" in options:
        return check_for_early_or_late(formatted_section_data, "Late")
    elif "include-days" in options:
        return check_for_days(formatted_section_data, days, "include")
    elif "exclude-days" in options:
        return check_for_days(formatted_section_data, days, "exclude")
    elif "no-exams" in options:
        return not section_has_exam(section_data["meetings"])
    elif "add-suggested-courses":  # Must be last
        return True

    return False


def check_for_early_or_late(section: json, type: string):
    """This function takes in the section data as well as the time preference requested
    by the user (early or late class times). The 'early' option suggests courses that end
    in the AM, while the 'late' option suggests courses that end in the PM.

    :param section:
    :param type:
    :return:
    """
    count = 0
    meeting_time_array = get_section_meeting_times(section)
    for meeting in meeting_time_array:
        if type == "Early":
            if meeting[0].hour < 12:
                count += 1
        elif type == "Late":
            if meeting[0].hour > 12:
                count += 1
    if count == len(meeting_time_array):
        return True

    return False


def check_for_days(section: json, days: list, type: string):

    meeting_time_array = get_section_meeting_times(section)
    count = 0
    for meeting in meeting_time_array:
        if type == "include":
            if meeting[2] in days:
                count += 1
        elif type == "exclude":
            if meeting[2] not in days:
                count += 1
    if count == len(meeting_time_array):
        return True

    return False


def section_has_exam(section: json):
    for meeting in section:
        if "EXAM" in list(meeting.keys())[0]:
            return True

    return False
