import json
from datetime import datetime
from .search import search_course_with_section, find_all_sections
from .constants import BASE_DIR, SEMESTERS
from .parser import parse_course_name_and_section


def read_json(filePath: str):
    """Returns a dict from the course data JSON

    :param filePath: the path to the file containing JSON data
    """
    with open(filePath, "r") as f:
        return json.load(f)


# helper function to get data for requested courses using prototype functions
def retrieve_course_data(course_list, semester):
    file_path = BASE_DIR + "course_data_" + SEMESTERS[semester] + ".json"
    json_data = read_json(file_path)
    course_data = get_course_and_section_data(json_data, course_list)

    return update_conflicts(course_data)


# helper function to get data for sections of a given course
def retrieve_section_data(course, semester):
    file_path = BASE_DIR + "course_data_" + SEMESTERS[semester] + ".json"
    json_data = read_json(file_path)
    return get_section_data(json_data, course)


def generate_suggested_courses(semester, course_list, suggestion_type, days):
    """This function uses other helper functions to return a json object that
    has info about the suggested schedule

    :param semester: represents which semester we want courses from (eg. F22)
    :param course_list: List of courses and their sections searched by the user
    :param suggestion_type: the suggestion algorithm the user wants to use (eg. no exams)
    :param days: a list of days of the week to specifically include or exclude
    :return: Formatted json object representing info about the suggested schedule
    """
    from .suggestions import get_course_suggestions  # import here to avoid circular import

    options_list = ["add-suggested-courses"]

    file_path = BASE_DIR + "course_data_" + SEMESTERS[semester] + ".json"
    json_data = read_json(file_path)

    # append suggestion type if one other than default was given
    if suggestion_type != "default":
        options_list.append(suggestion_type)

    suggested_courses_list, invalid_courses_list = get_course_suggestions(json_data, course_list, options_list, days)
    suggested_courses_data = get_course_and_section_data(json_data, suggested_courses_list, invalid_courses_list)

    return update_conflicts(suggested_courses_data)


def get_course_and_section_data(course_map, course_list, invalid_courses=None):
    """This function uses the course data and the list of courses that the
    user would like to search for to return a json object containing the
    formatted course and section data.

    :param course_map: Course data dictionary
    :param course_list: List of courses and their sections searched by the user
    :return: Formatted course and section data
    """

    ret_obj = {"data": {}}

    # if the invalid courses list is not None or empty, the suggestions functions already took care of error handling
    if invalid_courses:
        errors = invalid_courses
    else:
        errors = []

    # Iterating over each course in the list of courses to search for
    for course in course_list:
        # Searching for each individual course
        section_data = search_course_with_section(course_map, course)
        # Error checking in case section is not found/invalid
        if section_data is None:
            errors += [course]
            continue

        formatted_section_data = format_section_data(section_data)

        # format course name to be of the form NAME*SECTION
        name, section = parse_course_name_and_section(course)
        formattedName = name + "*" + section
        ret_obj["data"][formattedName] = formatted_section_data

    ret_obj["errors"] = errors
    return ret_obj


def get_section_data(course_map, course_name):
    """This function uses the course data and the name of a specific course to return a formatted JSON object
    that contains info about all sections of the course

    :param course_map: json data for all courses
    :param course_name: the name of the course for which we want all sections of (eg. "CIS3760")
    :return: a JSON object that contains info about all of the sections of the given course
    """

    ret_obj = {"course": course_name, "sections": {}, "error_msg": ""}
    sections_list = []

    # retrieve all sections of the given course
    all_sections = find_all_sections(course_map, course_name)

    # return with errors if course wasn't found
    if all_sections is None:
        ret_obj["error_msg"] = f"The course {course_name} could not be found."
        return ret_obj

    # format each section and add it to the return object
    for section in all_sections:
        current_section = {
            "section_name": section,
            "section_data": format_section_data(all_sections[section]),
        }
        sections_list.append(current_section)

    ret_obj["sections"] = sections_list
    return json.dumps(ret_obj)


def format_section_data(section_data):
    """This function uses a JSON string of data that contains info about a single section of a course
    and formats it to match the structure expected on the front end

    :param section_data: a JSON string representing data of a single section
        (as returned from course_data.json object structure)
    :return: an newly formatted object that represents the section data
    """

    days_dict = {
        "Mon": "Monday",
        "Tues": "Tuesday",
        "Wed": "Wednesday",
        "Thur": "Thursday",
        "Fri": "Friday",
        "Sat": "Saturday",
        "Sun": "Sunday",
        "Education Days TBA": "N/A",  # special case for DE sections
    }

    formatted_section_data = {}

    # Iterating over each LEC/SEM/LAB/EXAM
    for meeting in section_data["meetings"]:

        # Retrieving the only key in the dictionary
        tmp = next(iter(meeting.values()))
        meeting_type_arr = tmp["meeting_type"].split(" ", 1)

        de_meeting_type = "Distance Education Days TBA"
        section_is_DE: bool = tmp["meeting_type"] == de_meeting_type

        if meeting_type_arr[1] == "Days TBA":
            continue

        if section_is_DE:
            meeting_type = "DE Meetings"  # special case for DE sections
        else:
            meeting_type = meeting_type_arr[0]

        meeting_days = [days_dict[d] for d in meeting_type_arr[1].split(", ")]

        # Returning times for LEC/SEM/LAB, removing the date for EXAM
        if section_is_DE:
            meeting_times = ["N/A", "N/A"]  # special case for DE sections
        else:
            meeting_times = (
                tmp["meeting_time"].split(" - ")
                if meeting_type != "EXAM"
                else tmp["meeting_time"].rsplit(" ", 1)[0].split(" - ")
            )

        # Formatting for json object before return
        formatted_section_data[meeting_type] = {
            "start_time": meeting_times[0],
            "end_time": meeting_times[1],
            "days": meeting_days,
        }

        if meeting_type == "EXAM":
            formatted_section_data["EXAM"]["date"] = tmp["meeting_time"].rsplit(" ", 1)[1][1:-1].replace("/", "-")

        formatted_section_data["conflicts"] = []

    return formatted_section_data


def get_section_meeting_times(section_data: json) -> list:
    """This function takes in a json object that represents a single section and
    returns a list of all meeting times for that section


    :param section_data: json object with information for a single section
    :return: A list of tuples of the format (start_time, end_time, day)
    """

    section_meetings = []
    for meeting in section_data:
        if meeting == "conflicts":
            continue

        section_meetings.extend(meeting_to_time(section_data[meeting]))

    return section_meetings


def meeting_to_time(meeting_time: json) -> list:
    """This function takes a single meeting object (i.e LEC/LAB/EXAM)
    and extracts the day as a string and the start and end time which are
    converted to datetime.time objects


    :param meeting_time: json object with information for a single meeting type
    :return: A list of tuples of the format (start_time, end_time, day)
    """

    meeting_days = meeting_time["days"]
    meeting_times = [meeting_time["start_time"], meeting_time["end_time"]]
    time_str_format = "%I:%M%p"
    times = []
    meetings = []

    for time_str in meeting_times:
        times.append(datetime.strptime(time_str, time_str_format).time())

    for day in meeting_days:
        meetings.append((*times, day))

    return meetings


def has_conflict(meeting_one: tuple, meeting_two: tuple) -> bool:
    """This functions checks if there is a conflict between two meeting times


    :param meeting_one: A tuple of the format (start_time, end_time, day)
    :param meeting_true: A tuple of the format (start_time, end_time, day)
    :return: True if there is conflict, False otherwise
    """

    if meeting_one[2] != meeting_two[2]:
        return False

    if meeting_one[0] >= meeting_two[0] and meeting_one[0] <= meeting_two[1]:
        return True
    elif meeting_one[1] >= meeting_two[0] and meeting_one[1] <= meeting_two[1]:
        return True

    return False


def check_for_conflicts(time_list_one: list, time_list_two: list) -> tuple:
    """This function takes two lists of meeting times and checks to see
    if times in either list has a conflict with the other list.
    (It will ignore conflicts in the same list)


    :param time_list_one: A list of tuples of the format
        (start_time, end_time, day)
    :param time_list_two: A list of tuples of the format
        (start_time, end_time, day)
    :return: a list of existing conflicts
    """

    conflicts = []
    for time_one in time_list_one:
        for time_two in time_list_two:
            if has_conflict(time_one, time_two):
                start_time_str = time_one[0].strftime("%I:%M%p")
                end_time_str = time_one[1].strftime("%I:%M%p")
                conflicts.append((start_time_str, end_time_str, time_one[2]))

    return conflicts


def update_conflicts(course_data):
    """This function takes a dict of courses and documents any conflicts that
    exist


    :param course_data: a dictionary of courses (following the same format as
        our returned JSON)
    :return: a JSON string that represents all info about meetings
        (ie. Lecs/Labs/Seminars) for all courses along with info about
        conflicts
    """

    courses = course_data["data"]
    course_names = list(courses.keys())
    course_times = get_course_times(courses)

    # loop through each course pairing and check for conflicts
    for first_course in course_names:
        for second_course in course_names:
            if first_course != second_course:
                conflict = check_for_conflicts(
                    course_times[first_course], course_times[second_course]
                )
                if conflict:
                    courses[first_course]["conflicts"].extend(conflict)

    return json.dumps({"data": courses, "errors": course_data["errors"]})


def get_course_times(courses):
    """This function extracts out all of the meetings for all courses and
        returns an object that holds this info


    :param courses: a list of course names
    :return: an object of the structure {
        courseName1: [(startTime, endTime, day), (startTime, endTime, day)],
        courseName2: [(startTime, endTime, day), (startTime, endTime, day)]
    }
    """
    course_times = {}

    for course in courses:
        lec_info = courses[course].get("LEC", "DNE")
        lab_info = courses[course].get("LAB", "DNE")
        sem_info = courses[course].get("SEM", "DNE")

        extracted_times = []

        if lec_info != "DNE":
            extracted_times.extend(meeting_to_time(lec_info))

        if lab_info != "DNE":
            extracted_times.extend(meeting_to_time(lab_info))

        if sem_info != "DNE":
            extracted_times.extend(meeting_to_time(sem_info))

        course_times[course] = extracted_times

    return course_times
