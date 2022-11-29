import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails as authenticate } from '../store/actions/userActions';

export default function useUser() {
    const dispatch = useDispatch();
    const { userInfo, token } = useSelector((state) => state.user);

    const all = (array, fn) => {
        return array.filter(fn).length === array.length;
    };

    useEffect(() => {
        if (all(Object.values(userInfo), (el) => el === null) && token) {
            // if not userInfo

            dispatch(authenticate());
        }
    }, [dispatch, userInfo, token]);

    return [token, userInfo];
}
