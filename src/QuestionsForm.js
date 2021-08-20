import React from 'react'
import { useGlobalContext } from './context'
import Modal from './Modal'

const QuestionsForm = () => {
  const {
    questions,
    questionIndex,
    params: { type },
    correctAnswers,
    nextQuestion,
    checkAnswer,
  } = useGlobalContext()

  const {
    question,
    correct_answer: correct,
    incorrect_answers: incorrect,
  } = questions[questionIndex]

  let answers = []
  if (type === 'multiple')
    answers = [...incorrect, correct]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)

  return (
    <main>
      <Modal />
      <section className='quiz'>
        <p className='correct-answers' style={{ marginBottom: '0.5rem' }}>
          correct answers: {correctAnswers}
        </p>
        <p className='correct-answers'>question number: {questionIndex + 1}</p>
        <article className='container'>
          <h2 dangerouslySetInnerHTML={{ __html: question }} />

          <div className='btn-container'>
            {type === 'multiple' &&
              answers.map((answer, index) => (
                <button
                  key={index}
                  className='answer-btn'
                  onClick={() => checkAnswer(answer === correct)}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              ))}
            {type === 'boolean' && (
              <>
                <button
                  className='answer-btn'
                  onClick={() => checkAnswer(correct === 'True')}
                >
                  True
                </button>
                <button
                  className='answer-btn'
                  onClick={() => checkAnswer(correct === 'False')}
                >
                  False
                </button>
              </>
            )}
          </div>
        </article>
        <button className='next-question' onClick={nextQuestion}>
          next-question
        </button>
      </section>
    </main>
  )
}

export default QuestionsForm
