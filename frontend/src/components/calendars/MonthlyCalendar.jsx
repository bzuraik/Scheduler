import React from 'react';
import { DayPilotMonth } from '@daypilot/daypilot-lite-react';
import { PropTypes } from 'prop-types';

const styles = {
  MonthlyCalendar: {
    display: 'flex',
    width: '100%',
    height: '85vh',
    justifyContent: 'center',
  },
};

export default function MonthlyCalendar({ calendarEvents }) {
  return (
    <div style={styles.MonthlyCalendar}>
      <DayPilotMonth
        startDate="2022-12-01"
        events={calendarEvents}
        eventClickHandling="Disabled"
        timeRangeSelectedHandling="Disabled"
        eventMoveHandling="Disabled"
        eventResizeHandling="Disabled"
        eventSelectHandling="Disabled"
      />
    </div>
  );
}

MonthlyCalendar.propTypes = {
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
      day: PropTypes.string,
      id: PropTypes.number.isRequired,
      toolTip: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
