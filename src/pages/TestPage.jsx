import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../config/apiRequest";
import "../styles/layout/test-page.css";

// Преобразование типа вопроса из API в локальный
const mapApiTypeToLocal = (type) => {
  if (type === "single_choice") return "single";
  if (type === "multiple_choice") return "multiple";
  if (type === "text_input") return "text";
  return type;
};

const TestPage = () => {
  const { testId } = useParams();
  const [testInfo, setTestInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState();
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchTest = async () => {
      try {
        const test = await apiRequest(`/v1/tests/${testId}`);
        setTestInfo(test);
        console.log(test);
        setTimeLeft(test.duration * 60);
        const questionsApi = await apiRequest(`/v1/tests/${testId}/questions`, {
          method: "GET",
        });

        const questionsMapped = questionsApi.map((q) => {
          const type = mapApiTypeToLocal(q.type);
          let correctAnswer = null;
          let options = null;

          if (type === "single") {
            options = q.answers.map((a) => a.text);
            const correct = q.answers.find((a) => a.isCorrect);
            correctAnswer = correct ? correct.text : null;
          } else if (type === "multiple") {
            options = q.answers.map((a) => a.text);
            correctAnswer = q.answers
              .filter((a) => a.isCorrect)
              .map((a) => a.text);
          } else if (type === "text") {
            correctAnswer = q.answers.map((a) => a.text)[0] || "";
          }

          return {
            id: q.id,
            text: q.text,
            type,
            options,
            correctAnswer,
          };
        });

        setQuestions(questionsMapped);
        setAnswers(Array(questionsMapped.length).fill(null));
        setTestStarted(true);
        setLoading(false);
      } catch (e) {
        setTestInfo(null);
        setQuestions([]);
      }
    };

    fetchTest();
  }, [testId]);

  useEffect(() => {
    const savedTest = localStorage.getItem("reactTest");
    console.log(savedTest);

    if (savedTest && testStarted === true) {
      const testData = JSON.parse(savedTest);

      const currentTime = new Date().getTime();
      const endTime = testData.startTime + testData.initialTime * 1000;

      if (currentTime < endTime) {
        setCurrentQuestion(testData.currentQuestion || 0);
        setAnswers(
          testData.answers && testData.answers.length
            ? testData.answers
            : Array(testData.questionCount || 0).fill(null)
        );
        setTimeLeft(Math.floor((endTime - currentTime) / 1000));
        setTestStarted(true);
      } else {
        localStorage.removeItem("reactTest");
        setTestStarted(false);
      }

      setLoading(false);
    }
  }, [testStarted]);

  useEffect(() => {
    if (testStarted && questions.length > 0) {
      try {
        const testData = {
          testId,
          currentQuestion,
          answers,
          startTime:
            new Date().getTime() - (testInfo.duration * 60 - timeLeft) * 1000,
          initialTime: testInfo.duration * 60,
          questionCount: questions.length,
        };
        localStorage.setItem("reactTest", JSON.stringify(testData));
      } catch (e) {
        // ignore
      }
    }
  }, [
    testStarted,
    testId,
    currentQuestion,
    answers,
    timeLeft,
    questions.length,
    testInfo,
  ]);

  // Таймер
  useEffect(() => {
    if (testStarted && timeLeft >= 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            localStorage.removeItem("reactTest");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft]);

  const handleSingleOptionSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleMultipleOptionSelect = (option) => {
    const newAnswers = [...answers];
    if (!newAnswers[currentQuestion]) {
      newAnswers[currentQuestion] = [option];
    } else {
      const index = newAnswers[currentQuestion].indexOf(option);
      if (index === -1) {
        newAnswers[currentQuestion] = [...newAnswers[currentQuestion], option];
      } else {
        newAnswers[currentQuestion] = newAnswers[currentQuestion].filter(
          (item) => item !== option
        );
      }
    }
    setAnswers(newAnswers);
  };

  const handleTextAnswer = (e) => {
    const text = e.target.value;
    setTextAnswer(text);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = text;
    setAnswers(newAnswers);
  };

  const isSingleOptionSelected = (option) => {
    return answers[currentQuestion] === option;
  };

  const isMultipleOptionSelected = (option) => {
    if (!answers[currentQuestion]) return false;
    return answers[currentQuestion].includes(option);
  };

  useEffect(() => {
    const currentQ = questions[currentQuestion];
    if (currentQ && currentQ.type === "text") {
      setTextAnswer(answers[currentQuestion] || "");
    }
  }, [currentQuestion, answers, questions]);

  const formatTime = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      return "00:00";
    }
    const minutes = Math.floor(Math.max(0, seconds) / 60);
    const remainingSeconds = Math.max(0, seconds) % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;

    questions.forEach((question, index) => {
      const userAnswer = answers[index];

      if (userAnswer === null) {
        unanswered++;
      } else if (question.type === "single" || question.type === "text") {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      } else if (question.type === "multiple") {
        const correctOptions = question.correctAnswer;

        if (
          userAnswer &&
          Array.isArray(userAnswer) &&
          userAnswer.length === correctOptions.length &&
          userAnswer.every((option) => correctOptions.includes(option))
        ) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    });

    return {
      correct: correctAnswers,
      incorrect: incorrectAnswers,
      unanswered: unanswered,
      total: questions.length,
      percentage: questions.length
        ? Math.round((correctAnswers / questions.length) * 100)
        : 0,
    };
  };

  const renderQuestion = () => {
    if (!questions[currentQuestion]) {
      return <div>Вопрос не найден</div>;
    }

    const question = questions[currentQuestion];

    return (
      <div className="question-container">
        <h2 className="question-text">{question.text}</h2>

        {question.type === "single" && question.options && (
          <div className="options-container">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option-item ${
                  isSingleOptionSelected(option) ? "selected" : ""
                }`}
                onClick={() => handleSingleOptionSelect(option)}
              >
                <div className="option-content">
                  <input
                    type="radio"
                    checked={isSingleOptionSelected(option)}
                    onChange={() => {}}
                  />
                  <span className="option-text">{option}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {question.type === "multiple" && question.options && (
          <div className="options-container">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option-item ${
                  isMultipleOptionSelected(option) ? "selected" : ""
                }`}
                onClick={() => handleMultipleOptionSelect(option)}
              >
                <div className="option-content">
                  <input
                    type="checkbox"
                    checked={isMultipleOptionSelected(option)}
                    onChange={() => {}}
                  />
                  <span className="option-text">{option}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {question.type === "text" && (
          <div>
            <input
              type="text"
              className="text-input"
              placeholder="Введите ответ..."
              value={textAnswer}
              onChange={handleTextAnswer}
            />
          </div>
        )}
      </div>
    );
  };

  const TestResults = ({ results, questions, answers, onRetake }) => {
    return (
      <div className="results-container">
        <h1 className="results-title">Результаты теста</h1>
        <div className="results-summary">
          <div className="summary-header">
            <h2 className="summary-title">Итоговый результат</h2>
            <div className="summary-percentage">{results.percentage}%</div>
          </div>
          <div className="summary-stats">
            <div className="stat-item correct">
              <div className="stat-label">Правильных ответов</div>
              <div className="stat-value correct">{results.correct}</div>
            </div>
            <div className="stat-item incorrect">
              <div className="stat-label">Неправильных ответов</div>
              <div className="stat-value incorrect">{results.incorrect}</div>
            </div>
            <div className="stat-item unanswered">
              <div className="stat-label">Без ответа</div>
              <div className="stat-value unanswered">{results.unanswered}</div>
            </div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${results.percentage}%` }}
            ></div>
          </div>
          <div className="progress-label">
            {results.correct} из {results.total}
          </div>
        </div>
        <div className="retake-button-container">
          <button className="retake-button" onClick={onRetake}>
            Пройти тест заново
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Загрузка теста...</div>;
  }

  if (!testInfo || questions.length === 0) {
    return <div>Тест не найден или не содержит вопросов</div>;
  }

  return (
    <>
      {!showResults ? (
        <div className="test-container">
          <h1 className="test-title">{testInfo.title || "Тест"}</h1>
          <div className="timer-container">
            <div className={`timer ${timeLeft < 300 ? "warning" : ""}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="questions-nav">
            {questions.map((question, index) => (
              <button
                key={index}
                className={`question-number ${
                  answers[index] !== null ? "answered" : ""
                } ${currentQuestion === index ? "current" : ""}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          {renderQuestion()}
          <div className="nav-buttons">
            <button
              className={`button-prev ${
                currentQuestion > 0 ? "active" : "disabled"
              }`}
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                }
              }}
              disabled={currentQuestion === 0}
            >
              Предыдущий
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                className="button-next"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                Следующий
              </button>
            ) : (
              <button
                className="button-finish"
                onClick={() => {
                  localStorage.removeItem("reactTest");
                  setTimeLeft(0);
                  setShowResults(true);
                }}
              >
                Завершить тест
              </button>
            )}
          </div>
          <div className="progress-container">
            <div className="progress-text">
              Отвечено на {answers.filter((answer) => answer !== null).length}{" "}
              из {questions.length} вопросов
            </div>
          </div>
        </div>
      ) : (
        <TestResults
          results={calculateResults()}
          questions={questions}
          answers={answers}
          onRetake={() => {
            setAnswers(Array(questions.length).fill(null));
            setCurrentQuestion(0);
            setTimeLeft(30 * 60);
            setShowResults(false);
          }}
        />
      )}
    </>
  );
};

export default TestPage;
