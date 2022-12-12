from .parser import parse_course_name_and_section


def search_course_with_section(course_map, search_course_code):

    # Converting to uppercase so it will work even if the user enters lowercase
    search_course_code = search_course_code.upper()
    course, section = parse_course_name_and_section(search_course_code)

    # input couldn't be parsed, return None
    if course == "Error":
        return None

    # Returning section if it was found
    if course in course_map:
        if section in course_map[course]["sections"]:
            return course_map[course]["sections"][section]
        else:
            return None
    else:
        return None


# given JSON data about all courses and a specific course, return all available sections
def find_all_sections(course_map, search_course_code):

    # Returning section if course was found in the map
    if search_course_code in course_map:
        return course_map[search_course_code]["sections"]
    else:
        return None
