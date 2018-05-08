import { combineReducers } from "redux";
import localData from "./setLocalData.js";
import globalData from "./setGlobalData.js";
import local from "./setTestData.js";

export default combineReducers({
  local: setLocalData,
  global: globalData,
  data: local
});
