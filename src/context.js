import React, {
  useState,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react'
import axios from 'axios'

import { questionsReducer, setupReducer } from './reducer'

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

const API_ENDPOINT = 'https://opentdb.com/api.php?'
const API_CATEGORIES = 'https://opentdb.com/api_category.php'
const API_TOTALS = 'https://opentdb.com/api_count_global.php'

const AppContext = React.createContext()

const questionsInitialState = {
  error: null,
  questions: [],
  questionIndex: 0,
  correctAnswers: 0,
  modalState: false,
}

const setupInitialState = {
  url: 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple',
  questionsSetup: true,
  isLoading: false,
  params: {
    amount: 10,
    category: -1,
    difficulty: 'easy',
    type: 'multiple',
  },
  categories: [],
}

const AppProvider = ({ children }) => {
  const [questionsState, questionsDispatch] = useReducer(
    questionsReducer,
    questionsInitialState
  )

  const [setupState, setupDispatch] = useReducer(
    setupReducer,
    setupInitialState
  )

  const [categoriesList, setCategoriesList] = useState([])
  const [categoriesTotals, setCategoriesTotals] = useState({})

  const setError = useCallback((error) => {
    questionsDispatch({
      type: SET_ERROR,
      payload: error,
    })
    toggleSetupAndLoading(true, false)
  }, [])

  const toggleSetupAndLoading = (questionsSetup, isLoading) =>
    setupDispatch({
      type: SET_SETUP_AND_LOADING,
      payload: { questionsSetup, isLoading },
    })

  const nextQuestion = (correct = false) =>
    questionsDispatch({
      type: NEXT_QUESTION,
      payload: correct,
    })

  const checkAnswer = (value) => nextQuestion(value)

  const closeModal = () => {
    questionsDispatch({ type: CLOSE_MODAL })
    setupDispatch({ type: CLOSE_MODAL })
  }

  const setAmount = (value) => {
    value = parseInt(value)
    if (!value) return 1
    if (value > 50) return 50
    return value
  }

  const fetchQuestions = async (url) => {
    toggleSetupAndLoading(false, true)

    return axios(url)
      .then((res) => {
        if (res.data.response_code === 0) {
          questionsDispatch({
            type: SET_QUESTIONS,
            payload: res.data.results,
          })
          toggleSetupAndLoading(false, false)
        } else if (res.data.response_code === 1) {
          setError(
            `No Results: The API doesn't have enough questions for your query.`
          )
        } else if (res.data.response_code === 2) {
          setError(`Invalid Parameter: Arguements passed aren't valid.`)
        } else if (res.data.response_code === 3) {
          setError(`Token Not Found: Session Token does not exist.`)
        } else if (res.data.response_code === 4) {
          setError(
            `Token Empty Session: Token has returned all possible questions for the specified query.`
          )
        }
      })
      .catch((err) => setError(err.toString()))
  }

  const handleChange = (e) => {
    const name = e.target.name
    let value = e.target.value

    if (name === 'amount') value = setAmount(value)

    if (name === 'category') value = parseInt(value)

    setupDispatch({
      type: SET_PARAMETER,
      payload: { name, value },
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { amount, category, difficulty, type } = setupState.params

    const categoryParam = category > -1 ? `&category=${category}` : ''
    const url = `${API_ENDPOINT}amount=${amount}${categoryParam}&difficulty=${difficulty}&type=${type}`

    fetchQuestions(url)
  }

  const setCategories = useCallback(() => {
    axios(API_CATEGORIES)
      .then((res) => setCategoriesList(res.data.trivia_categories))
      .catch((err) => console.log(err))

    axios(API_TOTALS)
      .then((res) => setCategoriesTotals(res.data.categories))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    setCategories()
  }, [setCategories])

  useEffect(() => {
    if (categoriesList.length > 0 && Object.keys(categoriesTotals).length > 0) {
      setupDispatch({
        type: SET_CATEGORIES,
        payload: categoriesList.map((category) => {
          return {
            ...category,
            total: categoriesTotals[`${category.id}`].total_num_of_questions,
          }
        }),
      })
    }
  }, [categoriesList, categoriesTotals])

  return (
    <AppContext.Provider
      value={{
        ...questionsState,
        ...setupState,
        nextQuestion,
        checkAnswer,
        closeModal,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
