import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import "./Quizz.css";
import Blank from "./Blank";
import useLoginhook from "../hook/useLoginhook";

const Quizz = ({ userRole }) => {
  const navigate = useNavigate();
  const { User } = useLoginhook();

  // --- Initial Data ---
  const initialQuestions = [
    {
      id: 1,
      question: "At what age should the first dose of the MMR vaccine be administered?",
      options: ["6 months", "1 year", "2 years", "3 years"],
      correctAnswer: "1 year",
    },
    {
      id: 2,
      question: "What is the normal range of respiratory rate for an infant?",
      options: ["20-30 breaths/min", "30-60 breaths/min", "40-80 breaths/min", "60-100 breaths/min"],
      correctAnswer: "30-60 breaths/min",
    },
    {
      id: 3,
      question: "Which of the following is a common symptom of pediatric dehydration?",
      options: ["Fever", "Cough", "Decreased urination", "Vomiting"],
      correctAnswer: "Decreased urination",
    },
    {
      id: 4,
      question: "What is the recommended daily vitamin D intake for children aged 1 to 18?",
      options: ["200 IU", "400 IU", "600 IU", "800 IU"],
      correctAnswer: "600 IU",
    },
    {
      id: 5,
      question: "Which of the following is a common cause of acute diarrhea in children?",
      options: ["Rotavirus", "Influenza", "Strep throat", "Chickenpox"],
      correctAnswer: "Rotavirus",
    },
  ];

  // --- State ---
  const [questions, setQuestions] = useState(() => {
    const stored = sessionStorage.getItem("quizQuestions");
    return stored ? JSON.parse(stored) : initialQuestions;
  });

  const [dbPerformance, setDbPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testState, setTestState] = useState("intro"); // intro, active, finished
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [finalScore, setFinalScore] = useState(null);

  // --- Redirect Logic ---
  useEffect(() => {
    if (userRole === null) navigate("/");
  }, [userRole, navigate]);

  // --- Persistence ---
  useEffect(() => {
    sessionStorage.setItem("quizQuestions", JSON.stringify(questions));
  }, [questions]);

  // --- Data Fetching (Member View) ---
  const fetchPerformanceData = useCallback(async () => {
    if (userRole === 0) {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/quiz-results`);
        const data = await response.json();
        setDbPerformance(data);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userRole]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  // --- Handlers ---
  const handleStartTest = () => {
    setTestState("active");
    // Dynamic Time: 1 minute per question
    setTimeLeft(questions.length * 60);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  const handleAnswerSelect = (option) => {
    setUserAnswers({ ...userAnswers, [questions[currentQuestionIndex].id]: option });
  };

  const handleCompleteQuiz = useCallback(async () => {
    // If already finished, don't submit again
    if (testState === "finished") return;

    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) score++;
    });

    setFinalScore(score);
    setTestState("finished");

    // Persist to Database
    try {
      await fetch(`${import.meta.env.VITE_URL}/quiz-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: User?.name || "Anonymous Scholar",
          score: score,
          totalQuestions: questions.length,
        }),
      });
      // Refresh data locally
      fetchPerformanceData();
    } catch (error) {
      console.error("Failed to save quiz result:", error);
    }
  }, [questions, userAnswers, User?.name, testState, fetchPerformanceData]);

  // --- Timer Logic ---
  useEffect(() => {
    let timer;
    if (testState === "active" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && testState === "active") {
      handleCompleteQuiz();
    }
    return () => clearInterval(timer);
  }, [testState, timeLeft, handleCompleteQuiz]);

  const handleDeleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this record?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/quiz-results/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setDbPerformance(prev => prev.filter(item => item._id !== id));
        } else {
          alert("Failed to delete record.");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleDeleteAllRecords = async () => {
    if (window.confirm("⚠️ WARNING: This will permanently delete ALL performance records. This action cannot be undone. Are you sure?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/quiz-results/all`, {
          method: "DELETE",
        });
        if (response.ok) {
          setDbPerformance([]);
          alert("All records cleared successfully.");
        } else {
          alert("Failed to clear records.");
        }
      } catch (error) {
        console.error("Error clearing records:", error);
      }
    }
  };

  const exportToExcel = () => {
    const exportData = dbPerformance.map(item => ({
      "Student Name": item.studentName,
      "Score": item.score,
      "Total Questions": item.totalQuestions,
      "Percentage": `${Math.round((item.score / item.totalQuestions) * 100)}%`,
      "Date": new Date(item.date).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Results");
    
    XLSX.writeFile(workbook, "Academic_Performance_Logs.xlsx");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Sub-components: Assistant View ---
  const renderAssistantView = () => {
    if (testState === "intro") {
      return (
        <div className="assessment_gateway_hero animate_fade">
          <h1>Clinical Competency Assessment</h1>
          <p>
            Evaluate your expertise in pediatric care. This assessment consists of {questions.length} questions
            covering vaccines, growth milestones, and common symptoms.
          </p>
          <div className="analytics_summary_grid" style={{maxWidth: '600px', margin: '0 auto 40px'}}>
             <div className="analytics_card">
                <h5>Duration</h5>
                <div className="stat">{questions.length}m</div>
             </div>
             <div className="analytics_card">
                <h5>Questions</h5>
                <div className="stat">{questions.length}</div>
             </div>
             <div className="analytics_card">
                <h5>Pass Mark</h5>
                <div className="stat">80%</div>
             </div>
          </div>
          <button className="start_btn_premium" onClick={handleStartTest}>
            Initialize Assessment
          </button>
        </div>
      );
    }

    if (testState === "active") {
      const q = questions[currentQuestionIndex];
      const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

      return (
        <div className="assessment_active_view">
          <div className={`assessment_hud ${timeLeft < 60 ? "urgent" : ""}`}>
            <div className="timer_display">
              <span>⏱</span> {formatTime(timeLeft)}
            </div>
            <div className="progress_display">
              <span style={{fontWeight: 700, fontSize: '0.9rem'}}>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div className="progress_bar_bg">
                <div className="progress_bar_fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <button className="nav_btn submit" onClick={handleCompleteQuiz}>Finish Test</button>
          </div>

          <div className="question_card_cinematic">
            <h3 className="question_text">{q.question}</h3>
            <div className="options_grid">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`option_pill ${userAnswers[q.id] === opt ? "selected" : ""}`}
                  onClick={() => handleAnswerSelect(opt)}
                >
                  <span className="option_index">{String.fromCharCode(65 + i)}</span> {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="assessment_navigation">
            <button
              className="nav_btn prev"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((p) => p - 1)}
            >
              Previous
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button className="nav_btn submit" onClick={handleCompleteQuiz}>Complete Assessment</button>
            ) : (
              <button className="nav_btn next" onClick={() => setCurrentQuestionIndex((p) => p + 1)}>
                Next Question
              </button>
            )}
          </div>
        </div>
      );
    }

    if (testState === "finished") {
      return (
        <div className="result_screen_premium">
          <div className="result_score_box">
            <span className="score_num">{finalScore} / {questions.length}</span>
            <span className="score_label">Academic Score</span>
          </div>
          <h2>Assessment Complete</h2>
          <p style={{color: 'var(--quiz-secondary)', marginBottom: '40px'}}>
            Your performance has been recorded. {finalScore / questions.length >= 0.8 ? "Excellent work, Scholar!" : "A solid effort. Keep reviewing the material."}
          </p>
          <button className="start_btn_premium" onClick={() => setTestState("intro")}>
            Retake Assessment
          </button>
        </div>
      );
    }
  };

  // --- Sub-components: Member View ---
  const renderMemberView = () => {
    return (
      <div className="member_control_dashboard animate_fade">
        <div className="control_main_workspace">
          <div className="analytics_summary_grid">
            <div className="analytics_card">
              <h5>Total Assessments</h5>
              <div className="stat">{dbPerformance.length}</div>
            </div>
            <div className="analytics_card">
              <h5>Average Score</h5>
              <div className="stat">
                {dbPerformance.length > 0 
                  ? Math.round((dbPerformance.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / dbPerformance.length) * 100)
                  : 0}%
              </div>
            </div>
            <div className="analytics_card">
              <h5>Tracking Status</h5>
              <div className="stat" style={{fontSize: '1rem', color: 'var(--quiz-success)'}}>Live Synchronization</div>
            </div>
          </div>

          <div className="performance_table_box">
            <div className="editor_header">
                <h4>Recent Student Performance</h4>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button 
                    className="nav_btn next" 
                    style={{fontSize: '0.8rem', padding: '8px 15px', background: '#dc2626'}}
                    onClick={handleDeleteAllRecords}
                    disabled={dbPerformance.length === 0 || isLoading}
                  >
                    Clear All
                  </button>
                  <button 
                    className="nav_btn next" 
                    style={{fontSize: '0.8rem', padding: '8px 15px', background: '#059669'}}
                    onClick={exportToExcel}
                    disabled={dbPerformance.length === 0}
                  >
                    Export Excel
                  </button>
                  <button 
                    className="nav_btn next" 
                    style={{fontSize: '0.8rem', padding: '8px 15px', background: '#1e293b'}}
                    onClick={fetchPerformanceData}
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Refresh"}
                  </button>
                </div>
            </div>
            <table className="modern_table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assessment Date</th>
                  <th>Outcome</th>
                  <th style={{textAlign: 'right'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '40px'}}>Synchronizing with Academic Bank...</td></tr>
                ) : dbPerformance.length > 0 ? (
                  dbPerformance.map((p) => (
                    <tr key={p._id}>
                      <td><span className="student_name">{p.studentName}</span></td>
                      <td>{new Date(p.date).toLocaleDateString()}</td>
                      <td><span className="score_pill">{p.score} / {p.totalQuestions}</span></td>
                      <td style={{textAlign: 'right'}}>
                        <button 
                          onClick={() => handleDeleteRecord(p._id)}
                          style={{color: '#ef4444', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer'}}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '40px'}}>No records found in the database.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="question_bank_sidebar">
          <div className="editor_glass_box">
            <div className="editor_header">
              <h4>Academic Bank</h4>
              <button 
                className="nav_btn next" 
                style={{fontSize: '0.8rem', padding: '8px 15px'}}
                onClick={() => {
                  const newQ = { id: Date.now(), question: "", options: ["","","",""], correctAnswer: "" };
                  setQuestions([...questions, newQ]);
                }}
              >
                + Add Question
              </button>
            </div>
            
            <div className="bank_scroll_area" style={{maxHeight: '600px', overflowY: 'auto', paddingRight: '10px'}}>
              {questions.map((q, qIndex) => (
                <div key={q.id} className="editor_question_mini_card" style={{padding: '20px', borderBottom: '1px solid #f1f5f9'}}>
                   <div className="editor_form_group">
                      <label>Question {qIndex + 1}</label>
                      <textarea 
                        value={q.question} 
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIndex].question = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder="Define clinical probe..."
                      />
                   </div>
                   
                   <div className="options_editor_grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px'}}>
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="editor_form_group">
                           <label>Opt {String.fromCharCode(65 + optIndex)}</label>
                           <input 
                             type="text" 
                             value={opt}
                             onChange={(e) => {
                               const updated = [...questions];
                               updated[qIndex].options[optIndex] = e.target.value;
                               if (q.correctAnswer === opt) {
                                 updated[qIndex].correctAnswer = e.target.value;
                               }
                               setQuestions(updated);
                             }}
                             placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                           />
                        </div>
                      ))}
                   </div>

                   <div className="editor_form_group">
                      <label>Set Correct Answer</label>
                      <select 
                        value={q.options.indexOf(q.correctAnswer)}
                        onChange={(e) => {
                          const updated = [...questions];
                          const selectedIdx = parseInt(e.target.value);
                          updated[qIndex].correctAnswer = q.options[selectedIdx];
                          setQuestions(updated);
                        }}
                        className="premium_select"
                        style={{width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0'}}
                      >
                        <option value="-1">Select One...</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={i}>Option {String.fromCharCode(65 + i)}: {opt.substring(0, 20)}...</option>
                        ))}
                      </select>
                   </div>

                   <button 
                    style={{color: '#ef4444', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', padding: 0}}
                    onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                   >
                     Remove Question
                   </button>
                </div>
              ))}
            </div>

            <button 
                className="start_btn_premium" 
                style={{width: '100%', marginTop: '30px'}}
                onClick={() => alert("Bank Synchronized Successfully.")}
            >
              Sync Question Bank
            </button>
          </div>
        </aside>
      </div>
    );
  };

  return (
    <div className="quiz_module_wrapper">
      <div className="quiz_container_fluid">
        {userRole === 0 ? renderMemberView() : renderAssistantView()}
      </div>
      <Blank />
      <Blank />
    </div>
  );
};

export default Quizz;
