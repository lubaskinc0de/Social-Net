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

/**
 * Encode url param, e.g condition ? &{name}={value} : ''
 * @param {String} name
 * @param {String} value
 * @param {boolean} condition
 * @returns {String}
 */
export const urlParamEncode = (name, value, condition) => {
    return `${condition ? `&${name}=${value}` : ''}`;
};

/**
 * Find comment by id in root comments and their replies. Return null if not comment finded.
 * @param {Array} comments
 * @param {Number} commentId
 * @returns
 */
export const findComment = (comments, commentId) => {
    const rootComment = comments.find(({ id }) => commentId === id);

    if (rootComment) {
        return rootComment;
    }

    for (const root of comments) {
        const comment = root.replies.find(({ id }) => commentId === id);

        if (comment) return comment;
    }

    return null;
};
