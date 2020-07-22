import { combineReducers } from 'redux';
import { reducer } from 'redux-form';
import {
  SAVE_RESULT_REGULA,
  SAVE_RESULT_BAIRSTOW 
 } from '../actions'

const regulaResult = (state={}, action) => {
  switch (action.type){
    case SAVE_RESULT_REGULA:
      // make sure that sidebar exists in defaultDisplaySettings
      return {...action.payload}
    default:
      return state
  }
}

const bairstowResult = (state={}, action) => {
  switch (action.type){
    case SAVE_RESULT_BAIRSTOW:
      // make sure that sidebar exists in defaultDisplaySettings
      return {...action.payload}
    default:
      return state
  }
}

export default combineReducers({
  regulaResult: regulaResult,
  bairstowResult: bairstowResult,
  form: reducer
})