import moment from 'moment';
import "moment-timezone";

const allZones = moment.tz
  .names()
  .filter((zone) => zone.includes("Etc/GMT+") || zone.includes("Etc/GMT-"))
  .sort((firstTimezone, secondTimezone) => {
    const firstNumber = +firstTimezone.slice(7);
    const secondNumber = +secondTimezone.slice(7);
    return firstNumber - secondNumber;
  });

const defaultTZ = moment.tz.guess(true);

export {allZones, defaultTZ}