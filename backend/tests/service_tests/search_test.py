import unittest
from backend.service import search


def get_test_course_map():
    test_course_map = {
        "CIS1500": {
            "sections": {"0101": "Data for 1500*0101", "0102": "Data for 1500*0102"}
        },
    }
    return test_course_map


class TestSearch(unittest.TestCase):
    def test_search_course_with_section_returns_correct_information(self):
        # arrange
        test_course_map = get_test_course_map()
        test_course = "CIS1500"
        test_section = "0102"

        # act
        return_val = search.search_course_with_section(
            test_course_map, test_course + test_section
        )

        # assert
        self.assertEqual(
            return_val, test_course_map[test_course]["sections"][test_section]
        )

    def test_search_course_with_section_returns_none_if_course_not_found(self):
        # arrange
        test_course_map = get_test_course_map()
        test_course = "NAC0000"
        test_section = "0102"

        # act
        return_val = search.search_course_with_section(
            test_course_map, test_course + test_section
        )

        # assert
        self.assertEqual(return_val, None)

    def test_search_course_with_section_returns_none_if_section_not_found(self):
        # arrange
        test_course_map = get_test_course_map()
        test_course = "CIS1500"
        test_section = "0000"

        # act
        return_val = search.search_course_with_section(
            test_course_map, test_course + test_section
        )

        # assert
        self.assertEqual(return_val, None)

    def test_find_all_sections_returns_correct_information(self):
        # arrange
        test_course_map = get_test_course_map()
        test_course = "CIS1500"

        # act
        return_val = search.find_all_sections(test_course_map, test_course)

        # assert
        self.assertEqual(return_val, test_course_map[test_course]["sections"])

    def test_find_all_sections_returns_none_if_course_not_found(self):
        # arrange
        test_course_map = get_test_course_map()
        test_course = "NAC0000"

        # act
        return_val = search.find_all_sections(test_course_map, test_course)

        # assert
        self.assertEqual(return_val, None)
