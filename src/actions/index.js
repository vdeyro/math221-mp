// Place to put action names
export const SAVE_RESULT = "SAVE_RESULT"

// ACTIONS
export const saveResult = (result) => {
  return {
    type: SAVE_RESULT,
    payload: result
  }
}
