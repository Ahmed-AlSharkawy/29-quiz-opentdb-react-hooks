import React from 'react'
import { useGlobalContext } from './context'

import SetupForm from './SetupForm'
import QuestionsForm from './QuestionsForm'
import Loading from './Loading'

function App() {
  const { questionsSetup, isLoading } = useGlobalContext()

  if (questionsSetup) return <SetupForm />

  if (isLoading) return <Loading />

  return <QuestionsForm />
}

export default App
