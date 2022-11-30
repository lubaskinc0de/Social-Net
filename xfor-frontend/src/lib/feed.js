import moment from 'moment';
import 'moment/locale/ru';

export function getTimeInfo(created_at) {
    const timesince = moment(Date.parse(created_at)).fromNow();
    const createdAtDate = new Date(created_at);

    const time = `${createdAtDate.getHours()}:${createdAtDate.getMinutes()}`;

    return [timesince, time];
}
