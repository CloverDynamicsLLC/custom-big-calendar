import React from "react";
import PropTypes from "prop-types";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import "moment-timezone";
import { renderFormat, timezones } from "../../utils/timezones.js";
import Autocomplete from "@mui/material/Autocomplete";

/**
 *Selector of timezones in popup.
 *
 * @export
 * @param {*} {
 *   title, Name of zone.
 *   allZones, Names of all moment zones.
 *   defaultTZ, Zone to be loaded from start.
 *   timezone,  current timezone.
 *   setTimezone, function to change timezone.
 * }
 * @return {*} timezones.
 */
export default function TimezoneSelect({ defaultTZ, timezone, setTimezone }) {
  const onChange = (event, newTimezone) => {
    setTimezone(newTimezone ?? defaultTZ);
  };

  return (
    <div className="gt-calendar-settings">
      <InputLabel id="gt-select-timezone-label">Select a timezone</InputLabel>
      <Autocomplete
        className="gt-search"
        label="Select a timezone"
        style={{ minWidth: 350, paddingRight: 32 }}
        value={timezone}
        options={timezones}
        getOptionLabel={renderFormat}
        onChange={onChange}
        renderInput={(params) => <TextField className="search-input" {...params} />}
      />
    </div>
  );
}

TimezoneSelect.propTypes = {
  title: PropTypes.string,
  defaultTZ: PropTypes.string,
  timezone: PropTypes.string,
  setTimezone: PropTypes.func,
};