import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookie";

// *** INITIAL STATES ***
const initialState = {
    user: null,
};

// *** ACTIONS ***
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";

// *** ACTION CREATORS ***
const logIn = createAction(LOG_IN, (user) => ({ user }));
const logOut = createAction(LOG_OUT, (user) => ({ user }));


// *** MIDDLEWARES ***
const loginMiddleware = (loginRequestBody) => {
    return (dispatch, getState, { history }) => {
        axios.post('http://localhost:5000/api/users/login', loginRequestBody)
            .then((response) => {
                console.log(response.data);
                const token = response.data.token;

                // 기존 user 토큰이 쿠키에 존재하면? 삭제
                if (getCookie("user")) {
                    deleteCookie("user");
                }
                setCookie('user', token);
                dispatch(logIn(token));
                window.location.href = "/";
            })
            .catch((error) => {
                // window.alert(error.response);
                window.alert("로그인 실패");
                deleteCookie("user");
                window.location.href = "/login";
            })
    };
};



// *** REDUCER ***
export default handleActions(
    {
        [LOG_IN]: (state, action) =>
            produce(state, (draft) => {
                const token = action.payload.user
                const decoded = jwt_decode(token);
                console.log("decoded", decoded);
                draft.user = decoded;
            }),
        [LOG_OUT]: (state, action) =>
            produce(state, (draft) => {
                draft.user = null;
            }),
        // [GET_USER]: (state, action) => produce(state, (draft) => { }),
    },
    initialState
);


export const actionCreators = {
    logIn,
    logOut,
    loginMiddleware,
};