import React from 'react';
import { Timeline, Button } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";

const TimelineComponent = ({ days }) => {
  const renderTimelineItems = () => {
    const items = [];
    for (let i = 0; i < days; i++) {
      items.push(
        <Timeline.Item key={`day-${i}`}>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Time>Day {i + 1}</Timeline.Time>
            <Timeline.Title>Activities for Day {i + 1}</Timeline.Title>
            <Timeline.Body>
              Get access to over 20+ pages including a dashboard layout,
              charts, kanban board, calendar, and pre-order E-commerce &
              Marketing pages.
            </Timeline.Body>
            <Button color="gray">
              Learn More
              <HiArrowNarrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Timeline.Content>
        </Timeline.Item>
      );
    }
    return items;
  };

  return (
    <div id="Third-Row-Timeline-Activities" className="mb-8 flex justify-center">
      <div className="w-4/5">
        <Timeline>
          {renderTimelineItems()}
        </Timeline>
      </div>
    </div>
  );
};

export default TimelineComponent;