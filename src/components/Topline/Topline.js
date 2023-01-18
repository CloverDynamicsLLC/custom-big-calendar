import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import TimezoneSelect from "./TimezoneSelect";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { textDurationCalendar } from "../../constants/constants";
import { allZones, defaultTZ } from "../Calendar/Timezone.js";

const Topline = (props) => {
    const { setTimezone, timezone, setStateEvents, stateEvents } = props
  const inputArr = [
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];

  const [inputs, setInputs] = useState(inputArr);
  const addInput = () => {
    setInputs((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
        },
      ];
    });
  };
  const handleDurationChange = (event) => {
    setStateEvents((prevState) => ({
      ...prevState,
      minutes: event.target.value,
    }));
  };
  return (
    <div className="gt-topbar">
      <div className="gt-calendar-settings">
        <InputLabel id="gt-select-duration-label">Duration</InputLabel>
        <Select
          labelId="gt-select-duration-label"
          id="gt-select-duration"
          value={stateEvents.minutes}
          label="Duration"
          onChange={handleDurationChange}
        >
          <MenuItem value={15}>15 min</MenuItem>
          <MenuItem value={30}>30 min</MenuItem>
          <MenuItem value={45}>45 min</MenuItem>
          <MenuItem value={60}>1 hour</MenuItem>
          <MenuItem value={20}>
            {textDurationCalendar[textDurationCalendar.length - 1]}
          </MenuItem>
          {/* 
              create service for list of values in future
             */}
        </Select>
      </div>
      <TimezoneSelect
        defaultTZ={defaultTZ}
        timezone={timezone}
        allZones={allZones}
        setTimezone={setTimezone}
      />
      <div className="gt-calendar-settings">
        <InputLabel id="gt-select-search-label">Add user</InputLabel>
        <div className="gt-inputs-list">
          {inputs.map((item, i) => {
            return <SearchBar />;
          })}
          <IconButton aria-label="add input" onClick={addInput} color="primary">
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Topline;
