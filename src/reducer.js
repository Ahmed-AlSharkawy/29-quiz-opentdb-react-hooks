import {
  /* SETUP_ACTIONS */
  SET_SETUP_AND_LOADING,
  SET_CATEGORIES,
  SET_PARAMETER,
  /* QUESTIONS_ACTIONS */
  SET_QUESTIONS,
  SET_ERROR,
  NEXT_QUESTION,
  /* COMMON_ACTIONS */
  CLOSE_MODAL,
} from './actions'

/* Questions Reducer*/
export const questionsReducer = (state, { type, payload }) => {
  switch (type) {
    case SET_QUESTIONS:
      return {
        ...state,
        error: null,
        questions: payload,
        questionIndex: 0,
        correctAnswers: 0,
      }

    case SET_ERROR:
      return { ...state, error: payload, questions: [] }

    case NEXT_QUESTION:
      const { questionIndex, questions, correctAnswers } = state
      const isLastIndex = questionIndex >= questions.length - 1
      return {
        ...state,
        questionIndex: isLastIndex === true ? questionIndex : questionIndex + 1,
        correctAnswers: payload === true ? correctAnswers + 1 : correctAnswers,
        modalState: isLastIndex,
      }

    case CLOSE_MODAL:
      return {
        ...state,
        modalState: false,
      }

    default:
      throw new Error(`Action type "${type}" not handled`)
  }
}

/* end of Questions Reducer*/

/* Setup Reducer*/
export const setupReducer = (state, { type, payload }) => {
  switch (type) {
    case SET_SETUP_AND_LOADING:
      const { questionsSetup, isLoading } = payload
      return { ...state, questionsSetup, isLoading }

    case SET_CATEGORIES:
      return {
        ...state,
        questionsSetup: true,
        isLoading: false,
        categories: payload,
      }

    case CLOSE_MODAL:
      return {
        ...state,
        questionsSetup: true,
        isLoading: false,
        params: {
          amount: 10,
          category: -1,
          difficulty: 'easy',
          type: 'multiple',
        },
      }

    case SET_PARAMETER:
      return {
        ...state,
        params: { ...state.params, [payload.name]: payload.value },
      }

    default:
      throw new Error(`Action type "${type}" not handled`)
  }
}
/* end of Setup Reducer*/
