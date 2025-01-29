import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Quizz.css"; // Add any specific styling in this file
import Blank from "./Blank";

const Quizz = ({ userRole }) => {
  const initialQuestions = [
    {
      id: 1,
      question:
        "At what age should the first dose of the MMR vaccine be administered?",
      options: ["6 months", "1 year", "2 years", "3 years"],
      correctAnswer: "1 year",
    },
    {
      id: 2,
      question: "What is the normal range of respiratory rate for an infant?",
      options: [
        "20-30 breaths/min",
        "30-60 breaths/min",
        "40-80 breaths/min",
        "60-100 breaths/min",
      ],
      correctAnswer: "30-60 breaths/min",
    },
    {
      id: 3,
      question:
        "Which of the following is a common symptom of pediatric dehydration?",
      options: ["Fever", "Cough", "Decreased urination", "Vomiting"],
      correctAnswer: "Decreased urination",
    },
    {
      id: 4,
      question:
        "What is the recommended daily vitamin D intake for children aged 1 to 18?",
      options: ["200 IU", "400 IU", "600 IU", "800 IU"],
      correctAnswer: "600 IU",
    },
    {
      id: 5,
      question:
        "Which of the following is a common cause of acute diarrhea in children?",
      options: ["Rotavirus", "Influenza", "Strep throat", "Chickenpox"],
      correctAnswer: "Rotavirus",
    },
    {
      id: 6,
      question: "At what age can most children start walking independently?",
      options: ["6 months", "12 months", "18 months", "24 months"],
      correctAnswer: "12 months",
    },
    {
      id: 7,
      question:
        "Which vitamin is essential for preventing rickets in children?",
      options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
      correctAnswer: "Vitamin D",
    },
    {
      id: 8,
      question: "Which of these is a common cause of anemia in children?",
      options: [
        "Vitamin A deficiency",
        "Vitamin C deficiency",
        "Iron deficiency",
        "Calcium deficiency",
      ],
      correctAnswer: "Iron deficiency",
    },
    {
      id: 9,
      question:
        "What condition is characterized by a barking cough in children?",
      options: ["Bronchitis", "Croup", "Asthma", "Pneumonia"],
      correctAnswer: "Croup",
    },
    {
      id: 10,
      question:
        "What is the leading cause of accidental injury in children under five?",
      options: ["Drowning", "Falls", "Poisoning", "Burns"],
      correctAnswer: "Drowning",
    },
  ];

  // Load questions from sessionStorage or use initialQuestions
  const [questions, setQuestions] = useState(() => {
    const storedQuestions = sessionStorage.getItem("quizQuestions");
    return storedQuestions ? JSON.parse(storedQuestions) : initialQuestions;
  });

  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const quizRef = useRef(null);
  const navigate = useNavigate();

  // Save questions to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem("quizQuestions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    if (userRole === null) {
      navigate("/");
    }
  }, [userRole, navigate]);

  const handleAnswerChange = (e, questionId) => {
    setUserAnswers({ ...userAnswers, [questionId]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  const handleStartQuiz = () => {
    quizRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const handleSubmitQuestions = () => {
    console.log("Submitting questions:", questions);
    alert("Questions submitted successfully!");
    sessionStorage.setItem("quizQuestions", JSON.stringify(questions));
  };

  return (
    <div className="color">
      <button className="button" onClick={handleStartQuiz}>
        Start the Quiz
      </button>
      <Blank></Blank>
      <Blank></Blank>
      <Blank></Blank>

      <div ref={quizRef} className="quiz-container">
        <h2>Pediatric Quiz</h2>
        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={q.id} className="question-block">
              <h4>
                Question {index + 1}:{" "}
                {userRole === 0 ? (
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    placeholder="Type your question here"
                  />
                ) : (
                  <span>{q.question}</span>
                )}
              </h4>
              {q.options.map((option, optIndex) => (
                <div key={optIndex} className="option">
                  <label>
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      onChange={(e) => handleAnswerChange(e, q.id)}
                    />
                    {userRole === 0 ? (
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, e.target.value)
                        }
                        placeholder="Option text"
                      />
                    ) : (
                      <span>{option}</span>
                    )}
                  </label>
                </div>
              ))}
              {userRole === 0 && (
                <>
                  <div className="correct-answer">
                    <label>
                      Correct Answer:{" "}
                      <input
                        type="text"
                        value={q.correctAnswer}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                        placeholder="Correct answer"
                      />
                    </label>
                  </div>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    Delete Question
                  </button>
                </>
              )}
            </div>
          ))}
          {userRole === 0 && (
            <>
              <button className="m-2" type="button" onClick={handleAddQuestion}>
                Add New Question
              </button>
              <button
                className="m-2"
                type="button"
                onClick={handleSubmitQuestions}
              >
                Submit New Questions
              </button>
            </>
          )}
          <button type="submit">Submit Quiz</button>
        </form>
        {score !== null && (
          <div className="score">
            <h3>
              Your Score: {score} / {questions.length}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizz;
