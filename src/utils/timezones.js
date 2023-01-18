import moment from "moment-timezone";
const hasDigitRegex = /\d/;

const timezones = moment.tz
  .names()
  .filter((zone) => {
    return zone.trim().includes("/") && !zone.includes("Etc");
  })
  .sort(sortByUtcOffset);

function convertCityTimezoneToAbbr(cityTimezone) {
  const abbrTimezone = moment.tz(cityTimezone).zoneAbbr();
  return hasDigitRegex.test(abbrTimezone) ? null : abbrTimezone;
}

function convertCityTimezoneToGMT(cityTimezone) {
  return moment.tz(cityTimezone).format("Z");
}

function createTimezone(cityTimezone) {
  const timezones = { city: cityTimezone };
  timezones.abbr = convertCityTimezoneToAbbr(cityTimezone);
  timezones.GMT = convertCityTimezoneToGMT(cityTimezone);
  return timezones;
}

function renderFormat(cityTimezone) {
  const timezone = createTimezone(cityTimezone);
  return `GMT${timezone.GMT} ${timezone.abbr ?? "Time:"} ${timezone.city}`;
}

export function renderFormatInComposer(date) {
  const timezoneAbbr = hasDigitRegex.test(date.zoneAbbr())
    ? null
    : date.zoneAbbr();
  const timezoneGMT = date.format("Z");
  return `${renderTimezoneAbbr(timezoneAbbr)}${"GMT" + timezoneGMT}`;
}

function renderTimezoneAbbr(timezoneAbbr) {
  return timezoneAbbr ? timezoneAbbr + "/" : "";
}

function sortByUtcOffset(timezone1, timezone2) {
  return moment.tz(timezone1).utcOffset() - moment.tz(timezone2).utcOffset();
}

export { timezones, renderFormat };
