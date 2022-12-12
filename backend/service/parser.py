import re


def parse_course_name_and_section(course_info: str):
    """Given a string with the course_name and section,
    this function will separate the two and return them as a list

    Args:
        course_info: A string of course name and section

    Returns:
        If the string was parsed correctly: A list with 2 elements -> [course_name, course_section]
        If the string parsed incorrectly: None
    """

    course_info_list = re.findall(
        "([A-Z]{3,4})(?:\\*{0,})([0-9]{4})(?:\\*{0,})([0-9]{4}|[0-9]{2})",
        course_info.upper(),
    )

    # guard for list index out of range error caused if the input didn't match the pattern
    return [course_info_list[0][0] + course_info_list[0][1], course_info_list[0][2]] if len(course_info_list) > 0 else ["Error", "Error"]
