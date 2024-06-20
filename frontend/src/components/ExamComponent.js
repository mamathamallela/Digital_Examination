import React, { useState, useEffect } from 'react';
import questionsData from './questions';
import './ExamComponent.css'; 

const ExamComponent = ({ onSubmit }) => {
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes

  useEffect(() => {
    setExamQuestions(questionsData);
  }, []);



  const handleAnswerSelection = (questionId, selectedOption) => {
  setSelectedAnswers(prevAnswers => {
    const updatedAnswers = { ...prevAnswers };

    if (!updatedAnswers[questionId]) {
      updatedAnswers[questionId] = [];
    }

    const optionIndex = updatedAnswers[questionId].indexOf(selectedOption);

    if (optionIndex !== -1) {
      updatedAnswers[questionId].splice(optionIndex, 1);
    } else {
      updatedAnswers[questionId] = [selectedOption]; // Change to a single selection
    }
    
    return updatedAnswers;
  });
};



  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    if (timeLeft === 0) {
      clearInterval(timer);
      onSubmit(selectedAnswers); // Automatically submit when time is up
    }

    return () => clearInterval(timer);
  }, [timeLeft, selectedAnswers, onSubmit]);

  
  return (
    <div>
      <h3>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</h3>
      {examQuestions.map(category => (
        <div key={category.category}>
          <h3>{category.category}</h3>
          <ol>
            {category.questions.map(question => (
              <li key={question.id}>
                <p>{question.question}</p>
                <ul className="custom-options">
                  {question.options.map((option, i) => (
                    <li
                      key={i}
                      className={selectedAnswers[question.id]?.includes(option) ? 'selected' : ''}
                      onClick={() => handleAnswerSelection(question.id, option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <button onClick={() => onSubmit(selectedAnswers)}>Submit Exam</button>
    </div>
  );
};

export default ExamComponent;
