import unittest
import json
from datetime import time
from backend.service.constants import BASE_DIR
from backend.service import json as json_service
from unittest.mock import mock_open, patch


test_course_map = {
    "CIS1500": {
        "sections": {"0101": "Data for 1500*0101", "0102": "Data for 1500*0102"}
    },
}


class TestJson(unittest.TestCase):
    def test_read_json_returns_json_data(self):
        # arrange
        test_data = {"test_data": "data", "moreTestData": 1}
        test_path = "mock/file/path"
        # Setting up a mock for file open()
        mock_file = mock_open(read_data=json.dumps(test_data))

        # act
        with patch("builtins.open", mock_file, create=True) as m:
            return_val = json_service.read_json(test_path)

        # assert
        m.assert_called_with(test_path, "r")
        self.assertEqual(return_val, test_data)

    def test_meeting_to_time_returns_correct_value(self):
        # arrange
        json_str = """
            {
                "days": ["Mon", "Fri"],
                "start_time": "08:30AM",
                "end_time": "10:20AM",
                "location": "ROZH, Room 104"
            }
        """
        meeting_data = json.loads(json_str)
        expected_result = [
            (time(8, 30), time(10, 20), "Mon"),
            (time(8, 30), time(10, 20), "Fri"),
        ]

        # act
        result = json_service.meeting_to_time(meeting_data)

        # assert
        self.assertEqual(result, expected_result)

    def test_meeting_to_time_returns_correct_value_for_PM(self):
        # arrange
        json_str = """
            {
                "days": ["Fri"],
                "start_time": "08:30PM",
                "end_time": "10:20PM",
                "location": "ROZH, Room 104"
            }
        """
        meeting_data = json.loads(json_str)
        expected_result = [(time(20, 30), time(22, 20), "Fri")]

        # act
        result = json_service.meeting_to_time(meeting_data)

        # assert
        self.assertEqual(result, expected_result)

    def test_has_conflict_returns_true_on_conflict(self):
        # arrange
        test_meeting_one = (time(9, 30), time(11, 20), "Fri")
        test_meeting_two = (time(8, 30), time(10, 20), "Fri")

        # act & assert
        self.assertTrue(json_service.has_conflict(test_meeting_one, test_meeting_two))

    def test_has_conflict_returns_false_on_no_conflict(self):
        # arrange
        test_meeting_one = (time(9, 30), time(11, 20), "Fri")
        test_meeting_two = (time(11, 30), time(13, 20), "Fri")

        # act & assert
        self.assertFalse(json_service.has_conflict(test_meeting_one, test_meeting_two))

    def test_has_conflict_returns_false_on_diff_day(self):
        # arrange
        test_meeting_one = (time(9, 30), time(11, 20), "Fri")
        test_meeting_two = (time(9, 30), time(11, 20), "Mon")

        # act & assert
        self.assertFalse(json_service.has_conflict(test_meeting_one, test_meeting_two))

    def test_check_for_conflicts_returns_true_on_conflict(self):
        # arrange
        test_busy_times = [
            (time(9, 30), time(11, 20), "Mon"),
            (time(9, 30), time(11, 20), "Wed"),
            (time(9, 30), time(11, 20), "Fri"),
        ]
        test_course_meetings = [
            (time(11, 30), time(12, 20), "Mon"),
            (time(10, 30), time(12, 20), "Wed"),
        ]

        # act & assert
        self.assertTrue(
            json_service.check_for_conflicts(test_busy_times, test_course_meetings)
        )

    def test_check_for_conflicts_returns_false_on_no_conflict(self):
        # arrange
        test_busy_times = [
            (time(9, 30), time(11, 20), "Mon"),
            (time(9, 30), time(11, 20), "Wed"),
            (time(9, 30), time(11, 20), "Fri"),
        ]
        test_course_meetings = [
            (time(11, 30), time(12, 20), "Mon"),
            (time(11, 30), time(12, 20), "Wed"),
        ]

        # act & assert
        self.assertFalse(
            json_service.check_for_conflicts(test_busy_times, test_course_meetings)
        )

    @patch("backend.service.json.read_json", return_value=test_course_map)
    @patch(
        "backend.service.json.get_course_and_section_data",
        return_value=test_course_map["CIS1500"],
    )
    @patch("backend.service.json.update_conflicts", return_value=None)
    def test_retrieve_course_data(
        self, mock_update_conflicts, mock_get_course_and_section_data, mock_read_json
    ):
        # arrange
        mock_course_list = ["CIS1500"]
        mock_semester = "F22"
        mock_file_path = BASE_DIR + "course_data_" + mock_semester + ".json"

        # act
        result = json_service.retrieve_course_data(mock_course_list, "F22")

        self.assertEqual(result, None)
        mock_read_json.assert_called_with(mock_file_path)
        mock_get_course_and_section_data.assert_called_with(
            test_course_map, mock_course_list
        )
        mock_update_conflicts.assert_called_with(test_course_map["CIS1500"])

    @patch("backend.service.json.read_json", return_value=test_course_map)
    @patch(
        "backend.service.json.get_section_data",
        return_value=None,
    )
    def test_retrieve_section_data(self, mock_get_section_data, mock_read_json):
        # arrange
        mock_course = "CIS1500"
        mock_semester = "F22"
        mock_file_path = BASE_DIR + "course_data_" + mock_semester + ".json"

        # act
        result = json_service.retrieve_section_data(mock_course, "F22")

        self.assertEqual(result, None)
        mock_read_json.assert_called_with(mock_file_path)
        mock_get_section_data.assert_called_with(test_course_map, mock_course)
