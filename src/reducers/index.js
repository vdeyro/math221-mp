import { combineReducers } from 'redux';
import { reducer } from 'redux-form';
import {
  SAVE_RESULT, 
 } from '../actions'

const regulaResult = (state={}, action) => {
  switch (action.type){
    case SAVE_RESULT:
      // make sure that sidebar exists in defaultDisplaySettings
      return {...action.payload}
    default:
      return state
  }
}

export default combineReducers({
  regulaResult: regulaResult,
  form: reducer
})