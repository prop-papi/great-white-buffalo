import { combineReducers } from "redux";
import test1 from './testReducer1.js';
import test2 from './testReducer2.js';
import local from './setTestData.js';

export default combineReducers({
  createNumber: test1,
  searchNumber: test2,
  data: local,
});