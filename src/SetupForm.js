import React from 'react'
import { useGlobalContext } from './context'

const SetupForm = () => {
  const {
    params: { amount, category, difficulty, type },
    categories,
    error,
    handleChange,
    handleSubmit,
  } = useGlobalContext()

  return (
    <main>
      <section className='quiz quiz-small'>
        <form className='setupform'>
          <h2 style={{ marginBottom: '1.5rem' }}>setup quiz</h2>
          {/* amount field */}
          <div className='form-control'>
            <label htmlFor='amount'>number of questions</label>
            <input
              type='number'
              name='amount'
              id='amount'
              className='form-input'
              min={1}
              max={50}
              value={amount}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* end of amount field */}

          {/* category field */}
          <div className='form-control'>
            <label htmlFor='category'>category</label>
            <select
              name='category'
              id='category'
              className='form-input'
              min={1}
              max={50}
              value={category}
              onChange={(e) => handleChange(e)}
            >
              <option value={-1}>any category</option>
              {categories.length > 0 &&
                categories.map((categoryItem) => {
                  const { id, name } = categoryItem
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  )
                })}
            </select>
            {category !== -1 && (
              <p style={{ color: 'blue', marginTop: '0.3rem' }}>
                {` total questions in this category is
                ${
                  categories.length > 0 &&
                  categories.filter((item) => item.id === category)[0].total
                }.`}
              </p>
            )}
          </div>
          {/* end of category field */}

          {/* difficulty field */}
          <div className='form-control'>
            <label htmlFor='difficulty'>difficulty</label>
            <select
              name='difficulty'
              id='difficulty'
              className='form-input'
              min={1}
              max={50}
              value={difficulty}
              onChange={(e) => handleChange(e)}
            >
              <option value='easy'>easy</option>
              <option value='medium'>medium</option>
              <option value='hard'>hard</option>
            </select>
          </div>
          {/* end of difficulty field */}

          {/* type field */}
          <div className='form-control'>
            <label htmlFor='type'>type</label>
            <select
              name='type'
              id='type'
              className='form-input'
              min={1}
              max={50}
              value={type}
              onChange={(e) => handleChange(e)}
            >
              <option value='multiple'>multiple choice</option>
              <option value='boolean'>true / false</option>
            </select>
          </div>
          {/* end of type field */}

          {/* form footer */}
          {error && <p className='error'>{error}</p>}
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            start
          </button>
          {/* end of form footer */}
        </form>
      </section>
    </main>
  )
}

export default SetupForm
