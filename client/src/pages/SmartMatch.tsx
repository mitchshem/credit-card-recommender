import React, { useState } from 'react';

const SmartMatch: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const quizSteps = [
    {
      question: "What's your primary spending category?",
      options: ["Groceries", "Dining", "Travel", "Gas", "Online Shopping", "Everything"]
    },
    {
      question: "What's your preferred reward type?",
      options: ["Cash Back", "Travel Points", "Flexible Points", "Airline Miles", "Hotel Points"]
    },
    {
      question: "What's your annual fee preference?",
      options: ["No Annual Fee", "Low Fee ($1-$99)", "Medium Fee ($100-$299)", "High Fee ($300+)", "No Preference"]
    }
  ];

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentStep]: answer });
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎯 Smart Match</h1>
        <p>Take our quiz to find the perfect credit card for your lifestyle</p>
      </div>

      <div className="quiz-container">
        {currentStep < quizSteps.length ? (
          <div className="quiz-step">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
              />
            </div>
            
            <h3>Step {currentStep + 1} of {quizSteps.length}</h3>
            <h2>{quizSteps[currentStep].question}</h2>
            
            <div className="quiz-options">
              {quizSteps[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  className="quiz-option"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="quiz-results">
            <h3>🎉 Quiz Complete!</h3>
            <div className="results-summary">
              <h4>Your Preferences:</h4>
              <ul>
                <li><strong>Primary Spending:</strong> {answers[0]}</li>
                <li><strong>Reward Type:</strong> {answers[1]}</li>
                <li><strong>Annual Fee:</strong> {answers[2]}</li>
              </ul>
            </div>
            
            <div className="placeholder-content">
              <div className="card">
                <h4>Personalized Recommendations</h4>
                <p>Based on your answers, we would recommend cards that match your spending patterns and preferences.</p>
                <p><em>Coming soon - AI-powered card matching algorithm</em></p>
              </div>
            </div>
            
            <button className="action-btn primary" onClick={resetQuiz}>
              Take Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartMatch;
