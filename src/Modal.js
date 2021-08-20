import React from 'react'
import { useGlobalContext } from './context'

const Modal = () => {
  const { modalState, questions, correctAnswers, closeModal } =
    useGlobalContext()

  const result = ((correctAnswers / questions.length) * 100).toFixed(0)

  return (
    <div className={`modal-container ${modalState && 'isOpen'}`}>
      <div className='modal-content'>
        <h2>{result < 40 ? 'sorry!' : 'congrats!'}</h2>
        <p>you answered {result}% of questions correctly</p>
        <button className='close-btn' onClick={closeModal}>
          play again
        </button>
      </div>
    </div>
  )
}

export default Modal
