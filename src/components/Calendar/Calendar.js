import React, { useState, useCallback, useMemo, useEffect } from "react";
import events from "../../events";
import Topline from "../Topline/Topline";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "moment-timezone";
import {
  timesToMultiply,
  durationsCalendar
} from "../../constants/constants";
import { defaultTZ } from "./Timezone.js";

const DragAndDropCalendar = withDragAndDrop(Calendar);

const formatName = (name, count) => `${name} ID ${count}`;

const Dnd = (props) => {
  const [timezone, setTimezone] = useState(defaultTZ);

  const { localizer } = useMemo(() => {
    moment.tz.setDefault(timezone);
    return {
      localizer: momentLocalizer(moment),
    };
  }, [timezone]);

  useEffect(() => {
    return () => {
      moment.tz.setDefault(); // reset to browser TZ on unmount
    };
  }, []);
  const [stateEvents, setStateEvents] = useState({
    createdEvents: [],
    events: events,
    minutes: 15,
    draggedEvent: null,
    counters: {
      item1: 0,
      item2: 0,
    },
    displayDragItemInCell: true,
  });
  const createEvent = useCallback(
    (event) => {
      let timesPerDuration =
        (event.end - event.start) / 1000 / 60 / stateEvents.minutes;
      let idList = stateEvents.events.map((a) => a.id);
      // timesToMultiply = 2, shows how many events of current duration needed to be created in drag and drop to create mutltiple events
      // values.durationCalendar, all values of menuitems in duration
      if (
        timesPerDuration >= timesToMultiply &&
        stateEvents.minutes !== durationsCalendar[durationsCalendar.length - 1]
      ) {
        const newEvents = [];
        for (let step = 0; step < timesPerDuration; step++) {
          let newId = Math.max(...idList) + step + 1;
          let newEvent = {
            id: newId,
            title: event.title,
            allDay: event.isAllDay,
            start: new Date(
              event.start.getTime() + stateEvents.minutes * step * 60000
            ),
            end: new Date(
              event.start.getTime() + stateEvents.minutes * (step + 1) * 60000
            ),
          };
          if (
            new Date(
              event.start.getTime() + stateEvents.minutes * (step + 1) * 60000
            ) > event.end
          ) {
            break;
          }
          newEvents.push(newEvent);
        }
        setStateEvents((prevState) => ({
          ...prevState,
          events: [...stateEvents.events, ...newEvents],
          createdEvents: [...stateEvents.createdEvents, ...newEvents],
        }));
      } else {
        let newId = Math.max(...idList) + 1;
        let hour = {
          id: newId,
          title: event.title,
          allDay: event.isAllDay,
          start: event.start,
          end:
            stateEvents.minutes === 20
            // for custom duration event clicking, not draging, event for 20 mins will be craeted
              ? event.end
              : new Date(event.start.getTime() + stateEvents.minutes * 60000),
        };

        setStateEvents((prevState) => ({
          ...prevState,
          events: stateEvents.events.concat([hour]),
          createdEvents: stateEvents.createdEvents.concat([hour]),
        }));
      }
    },
    [stateEvents.createdEvents, stateEvents.events, stateEvents.minutes]
  );

  const dragFromOutsideItem = useCallback(() => {
    return stateEvents.draggedEvent;
  }, [stateEvents.draggedEvent]);

  const customOnDragOver = useCallback(
    (event) => {
      const undroppable = "undroppable";
      // check for undroppable is specific to this example
      // and not part of API. This just demonstrates that
      // onDragOver can optionally be passed to conditionally
      // allow draggable items to be dropped on cal, based on
      // whether event.preventDefault is called
      if (stateEvents.draggedEvent !== undroppable) {
        event.preventDefault();
      }
    },
    [stateEvents.draggedEvent]
  );

  const onDropFromOutside = useCallback(
    ({ start, end, allDay }) => {
      const { draggedEvent, counters } = stateEvents;
      const event = {
        title: formatName(draggedEvent.name, counters[draggedEvent.name]),
        start,
        end,
        isAllDay: allDay,
      };
      const updatedCounters = {
        ...counters,
        [draggedEvent.name]: counters[draggedEvent.name] + 1,
      };
      setStateEvents((prevState) => ({
        ...prevState,
        draggedEvent: null,
        counters: updatedCounters,
      }));
      createEvent(event);
    },
    [createEvent, stateEvents]
  );

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
      const { events } = stateEvents;

      const movableEventIndex = events.indexOf(event);
      let allDay = event.allDay;

      if (!event.allDay && droppedOnAllDaySlot) {
        allDay = true;
      } else if (event.allDay && !droppedOnAllDaySlot) {
        allDay = false;
      }

      const updatedEvent = { ...event, start, end, allDay };

      const nextEvents = [...events];
      nextEvents.splice(movableEventIndex, 1, updatedEvent);

      setStateEvents((prevState) => ({ ...prevState, events: nextEvents }));
    },
    [stateEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      const { events } = stateEvents;

      const nextEvents = events.map((existingEvent) => {
        return existingEvent.id === event.id
          ? { ...existingEvent, start, end }
          : existingEvent;
      });

      setStateEvents((prevState) => ({ ...prevState, events: nextEvents }));
    },
    [stateEvents]
  );

  return (
    <div>
      <Topline setTimezone={setTimezone} setStateEvents={setStateEvents} timezone={timezone} stateEvents={stateEvents} />
      <div className="example">
        <DragAndDropCalendar
          selectable
          localizer={localizer}
          events={stateEvents.events}
          onEventDrop={moveEvent}
          dragFromOutsideItem={
            stateEvents.displayDragItemInCell ? dragFromOutsideItem : null
          }
          onDropFromOutside={onDropFromOutside}
          onDragOver={customOnDragOver}
          resizable
          onEventResize={resizeEvent}
          onSelectSlot={createEvent}
          onSelectEvent={(event) => {
            setStateEvents((prevState) => ({
              ...prevState,
              events: stateEvents.events.filter((eve) => eve.id !== event.id),
            }));
          }}
          onD
          step={15}
          timeslots={4}
          defaultView={Views.WEEK}
          defaultDate={new Date(Date.now())}
          views={{ week: true, day: true }}
          messages={{ next: "Next", today: "Today", previous: "Previous" }}
        />
      </div>
    </div>
  );
};

export default Dnd;
