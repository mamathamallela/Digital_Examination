import React from 'react';
import questions from './questions';

const ViewQuestionsComponent = () => {
  return (
    <div>
      <h2>View Questions</h2>
      {questions.map((category, index) => (
        <div key={index}>
          <h3>{category.category}</h3>
          <ol>
            {category.questions.map((question) => (
              <li key={question.id}>
                <p>{question.question}</p>
                <ul>
                  {question.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
                <p>Correct Answer: {question.answer}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};

export default ViewQuestionsComponent;
