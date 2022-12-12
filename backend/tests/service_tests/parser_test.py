import unittest
from backend.service import parser


class TestParser(unittest.TestCase):
    def test_parse_course_name_and_section_returns_name_and_section(self):
        # arrange
        test_name_section = "CIS*3760*0101"
        expected_name = "CIS3760"
        expected_section = "0101"

        # act
        return_name, return_section = parser.parse_course_name_and_section(
            test_name_section
        )

        # assert
        self.assertEqual(return_name, expected_name)
        self.assertEqual(return_section, expected_section)

    def test_parse_course_name_and_section_returns_name_and_section_2(self):
        # arrange
        test_name_section = "CIS3760*0101"
        expected_name = "CIS3760"
        expected_section = "0101"

        # act
        return_name, return_section = parser.parse_course_name_and_section(
            test_name_section
        )

        # assert
        self.assertEqual(return_name, expected_name)
        self.assertEqual(return_section, expected_section)

    def test_parse_course_name_and_section_returns_name_and_section_3(self):
        # arrange
        test_name_section = "CIS37600101"
        expected_name = "CIS3760"
        expected_section = "0101"

        # act
        return_name, return_section = parser.parse_course_name_and_section(
            test_name_section
        )

        # assert
        self.assertEqual(return_name, expected_name)
        self.assertEqual(return_section, expected_section)

    def test_parse_course_name_and_section_returns_name_and_section_4(self):
        # arrange
        test_name_section = "CIS376001"
        expected_name = "CIS3760"
        expected_section = "01"

        # act
        return_name, return_section = parser.parse_course_name_and_section(
            test_name_section
        )

        # assert
        self.assertEqual(return_name, expected_name)
        self.assertEqual(return_section, expected_section)
