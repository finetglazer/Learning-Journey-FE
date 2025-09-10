import { combineReducers } from "@reduxjs/toolkit";
import commonSlice from "./common.slice";
import profileSlice from "./profile.slice";

const reducer = combineReducers({
  common: commonSlice.reducer,
  profile: profileSlice.reducer,
});

// const reducer = (state: any, action: any) => {
//   if (action.type === accountActions.cleanAccount.type) {
//     delete state?.home;
//     return appReducer(state, action);
//   }
//   return appReducer(state, action);
// };

export default reducer;

export const commonActions = commonSlice.actions;
export const profileActions = profileSlice.actions;
