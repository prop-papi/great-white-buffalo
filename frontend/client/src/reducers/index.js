import { combineReducers } from "redux";
import localData from "./setLocalData.js";
import globalData from "./setGlobalData.js";
import userPaneData from "./userPaneData.js";
import message from "./messageReducer.js";
import currentLounge from "./loungeReducer.js";

export default combineReducers({
  local: localData,
  global: globalData,
  userPane: userPaneData,
  // message: message
  currentLounge
});
