import { HYDRATE } from "next-redux-wrapper";
import { IAuthAction } from "../actions/authActions";
import { IActionWithPayload } from "../actions/IActionWithPayload";
import { initialAuthState } from "../state/user/authState";
import AuthType from "../types/authTypes";

const authReducer = (
  state = initialAuthState,
  action: IAuthAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    case AuthType.SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action?.payload?.isLoggedIn };
    case AuthType.SET_USER_TYPE:
      return { ...state, userType: action?.payload?.userType };
    case AuthType.SET_IS_AUTH_DIALOG_OPEN:
      return {
        ...state,
        authDialogState: action?.payload,
      };
    // This will overwrite client state - required for Next.js
    case HYDRATE: {
      return { ...action.payload.authReducer };
    }
    default:
      return state;
  }
};

export default authReducer;
