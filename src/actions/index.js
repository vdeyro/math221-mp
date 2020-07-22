// Place to put action names
export const SAVE_RESULT_REGULA = "SAVE_RESULT_REGULA"
export const SAVE_RESULT_BAIRSTOW = "SAVE_RESULT_BAIRSTOW"

// ACTIONS
export const saveResultRegula = (result) => {
  return {
    type: SAVE_RESULT_REGULA,
    payload: result
  }
}

export const saveResultBairstow = (result) => {
  return {
    type: SAVE_RESULT_BAIRSTOW,
    payload: result
  }
}
