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

    const time = `${createdAtDate
        .getHours()
        .toString()
        .padStart(2, '0')}:${createdAtDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

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
 * @returns {Object}
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

/**
 * Parse number of nextpage from link to the nextpage
 * @param {String} nextPageLink
 * @returns {Number}
 */
export const parsePageFromNextPage = (nextPageLink) => {
    if (!nextPageLink) {
        return null;
    }

    return parseInt(
        nextPageLink
            .split('?')
            .find((el) => el.includes('page'))
            .split('=')[1]
    );
};
