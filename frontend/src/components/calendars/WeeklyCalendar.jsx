import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import { PropTypes } from 'prop-types';

const styles = {
  weeklyCalendar: {
    display: 'flex',
    height: '80vh',
    justifyContent: 'center',
  },
};

export default function WeeklyCalendar({ calendarEvents }) {
  const [calendarColumns, setCalendarColumns] = useState([]);

  useEffect(() => {
    setCalendarColumns(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => ({ name: day, id: day })));
  }, []);

  return (
    <div style={styles.weeklyCalendar}>
      <DayPilotCalendar
        viewType="Resources"
        startDate={DayPilot.Date.today()}
        events={calendarEvents}
        columns={calendarColumns}
        eventClickHandling="Disabled"
        eventMoveHandling="Disabled"
        eventResizeHandling="Disabled"
        eventSelectHandling="Disabled"
        timeRangeSelectedHandling="Disabled"
        heightSpec="BusinessHours"
        businessBeginsHour={7}
        businessEndsHour={24}
      />
    </div>
  );
}

WeeklyCalendar.propTypes = {
  calendarEvents: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.shape({
        ticks: PropTypes.number,
        value: PropTypes.string,
      }).isRequired,
      end: PropTypes.shape({
        ticks: PropTypes.number,
        value: PropTypes.string,
      }).isRequired,
      backColor: PropTypes.string.isRequired,
      barHidden: PropTypes.bool.isRequired,
      borderColor: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
