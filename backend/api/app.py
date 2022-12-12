from flask import Flask, abort, request
from ..service.json import retrieve_course_data, retrieve_section_data, generate_suggested_courses
from ..service.constants import SEMESTERS

app = Flask(__name__)


# route for searching for courses
@app.route("/api/search")
def search():
    courses = []

    # get number of courses from url arguments
    numCourses = int(request.args.get("numCourses"))

    # get course names from arguments
    for i in range(1, 6):
        argName = "course" + str(i)
        courses.append(request.args.get(argName))

    # remove elements for courses that weren't entered
    n = 5 - numCourses
    courses = courses[: len(courses) - n]

    semester = request.args.get("semester")
    if semester is None:
        semester = SEMESTERS["F22"]  # Maintaining backwards compatibility.
    elif semester not in SEMESTERS:
        abort(422, "Invalid semester.")

    data = retrieve_course_data(courses, semester)

    return data


# route for obtaining all section info given a course
@app.route("/api/sections")
def sections():

    # get given course from args
    course = request.args.get("course").replace(" ", "")
    if "*" in course:
        course = course.replace("*", "")

    semester = request.args.get("semester")
    if semester is None:
        semester = SEMESTERS["F22"]  # Maintaining backwards compatibility.
    elif semester not in SEMESTERS:
        abort(422, "Invalid semester.")

    data = retrieve_section_data(course.upper(), semester)

    return data


# route for creating and obtaining data for a suggested schedule
@app.route("/api/suggestions")
def suggestions():

    courses = []

    # get arguments from URL params
    numCourses = int(request.args.get("numCourses"))

    for i in range(1, 5):
        argName = "course" + str(i)
        courses.append(request.args.get(argName))

    # remove elements for courses that weren't entered
    n = 4 - numCourses
    courses = courses[: len(courses) - n]

    semester = request.args.get("semester")
    if semester is None:
        semester = SEMESTERS["F22"]  # Maintaining backwards compatibility.
    elif semester not in SEMESTERS:
        abort(422, "Invalid semester.")

    suggestion_type = request.args.get("type")

    if "days" in suggestion_type:
        days_str = request.args.get("days")
        days = days_str.split(" ")
    else:
        days = []

    data = generate_suggested_courses(semester, courses, suggestion_type, days)

    return data


if __name__ == "__main__":
    app.run(host="0.0.0.0")
