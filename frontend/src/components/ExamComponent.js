import React, { useState, useEffect } from 'react';
import './ExamComponent.css';

const ExamComponent = (props) => {
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes
  const [timer, setTimer] = useState(null);
  const [warningShown, setWarningShown] = useState(false);

  const { onSubmit, questionPaper } = props;

  const handleAnswerSelection = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };

      if (!updatedAnswers[questionId]) {
        updatedAnswers[questionId] = [];
      }

      const optionIndex = updatedAnswers[questionId].indexOf(selectedOption);

      if (optionIndex !== -1) {
        updatedAnswers[questionId].splice(optionIndex, 1);
      } else {
        updatedAnswers[questionId] = [selectedOption];
        const isNumber = !isNaN(selectedOption);
        if (isNumber) {
          // If it's a number, parse it as an integer
          updatedAnswers[questionId] = [...updatedAnswers[questionId], parseInt(selectedOption)];
        } else {
          // If it's not a number, keep it as a string
          updatedAnswers[questionId] = [...updatedAnswers[questionId], selectedOption];
        }
      }
      // }

      return updatedAnswers;
    });
  };

  useEffect(() => {
    setExamQuestions(questionPaper);
  }, [questionPaper]);

  useEffect(() => {
    setTimer(
      setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000)
    );

    return () => clearInterval(timer);
  }, [timer]);

  const handleTabSwitch = () => {
    if (!warningShown && timer) {
      const shouldAllowSwitching = window.confirm(
        'Warning: Switching tabs during the exam is not allowed. Do you want to cancel the exam?'
      );

      setWarningShown(true);

      if (!shouldAllowSwitching) {
        // If not allowed, stop the exam or show a message
        clearInterval(timer);
        onSubmit(selectedAnswers); // Submit the exam or perform other actions
      }
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleTabSwitch);

    return () => {
      document.removeEventListener('visibilitychange', handleTabSwitch);
    };
  }, [handleTabSwitch]);

  return (
    <div className="exam-component-container">
      <div className="time-left-container">
        <h3>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</h3>
      </div>
      {examQuestions.map((category) => (
        <div key={category.category}>
          <h3>{category.category}</h3>
          <ol>
            {category.questions.map((question) => (
              <li key={question.id}>
                <p>{question.question}</p>
                <ul className="custom-options">
                  {question.options.map((option, i) => (
                    <li
                      key={i}
                      className={selectedAnswers[question.id]?.includes(option) ? 'selected' : ''}
                      onClick={() => handleAnswerSelection(question.id, option)}
                    >
                      {typeof option === 'number' ? option.toString() : option}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <button className="d-button" onClick={() => onSubmit(selectedAnswers)}>
        Submit Exam
      </button>
    </div>
  );
};

export default ExamComponent;
