// Action Types
export const UPDATE_USER_COUNT = "UPDATE_USER_COUNT";

// Action Interfaces
export interface UpdateUserCountAction {
  type: typeof UPDATE_USER_COUNT;
  payload: number;
  [key: string]: any;
}

export type UserCountActionTypes = UpdateUserCountAction;

// State Interface
export interface UserCountState {
  userCount: number;
}

// Initial State
const initialState: UserCountState = {
  userCount: 0,
};

// Reducer
export const userCountReducer = (
  state: UserCountState = initialState,
  action: UserCountActionTypes
): UserCountState => {
  switch (action.type) {
    case UPDATE_USER_COUNT:
      return {
        ...state,
        userCount: action.payload,
      };
    default:
      return state;
  }
};

// Action Creators
export const updateUserCount = (userCount: number): UpdateUserCountAction => ({
  type: UPDATE_USER_COUNT,
  payload: userCount,
});
