import { combineReducers } from "redux";
import localData from "./setLocalData.js";
import globalData from "./setGlobalData.js";
import local from "./setTestData.js";

export default combineReducers({
  local: localData,
  global: globalData,
  data: local
});
