import moment from 'moment';
import 'moment/locale/ru';

/**
 * Get timesince and time from created_at string
 * @param {String} created_at
 * @returns {[String, String]}
 */
export function getTimeInfo(created_at) {
    const timesince = moment(Date.parse(created_at)).fromNow();
    const createdAtDate = new Date(created_at);

    const time = `${createdAtDate.getHours()}:${createdAtDate.getMinutes()}`;

    return [timesince, time];
}
