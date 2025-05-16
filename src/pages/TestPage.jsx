import React, { useState, useEffect } from "react";
import "../styles/layout/test-page.css";

const TestPage = () => {
  const questions = [
    {
      id: 1,
      text: "Какой язык программирования используется в React?",
      type: "single",
      options: ["JavaScript", "Python", "Java", "C++"],
      correctAnswer: "JavaScript",
    },
    {
      id: 2,
      text: "Выберите все, что относится к хукам в React:",
      type: "multiple",
      options: ["useState", "useEffect", "useMemo", "useStyles"],
      correctAnswer: ["useState", "useEffect", "useMemo"],
    },
    {
      id: 3,
      text: "Как называется функция, которая возвращает JSX в функциональном компоненте?",
      type: "text",
      correctAnswer: "render",
    },
    {
      id: 4,
      text: "Какой метод жизненного цикла вызывается после рендеринга компонента в DOM?",
      type: "single",
      options: [
        "componentDidMount",
        "componentWillMount",
        "componentDidUpdate",
        "render",
      ],
      correctAnswer: "componentDidMount",
    },
    {
      id: 5,
      text: "Выберите все инструменты для управления состоянием в React:",
      type: "multiple",
      options: ["Redux", "MobX", "Context API", "Angular Services"],
      correctAnswer: ["Redux", "MobX", "Context API"],
    },
    {
      id: 6,
      text: 'Что такое "props" в React?',
      type: "single",
      options: [
        "Внутреннее состояние компонента",
        "Свойства, передаваемые от родительского компонента",
        "Методы класса",
        "Глобальные переменные",
      ],
      correctAnswer: "Свойства, передаваемые от родительского компонента",
    },
    {
      id: 7,
      text: "Какой хук используется для выполнения побочных эффектов в функциональных компонентах?",
      type: "text",
      correctAnswer: "useEffect",
    },
    {
      id: 8,
      text: "Что такое Virtual DOM в React?",
      type: "single",
      options: [
        "Библиотека для работы с DOM",
        "Виртуальное представление реального DOM",
        "Технология для создания 3D интерфейсов",
        "Формат хранения данных",
      ],
      correctAnswer: "Виртуальное представление реального DOM",
    },
    {
      id: 9,
      text: "Выберите все, что относится к преимуществам использования React:",
      type: "multiple",
      options: [
        "Компонентный подход",
        "Одностороннее связывание данных",
        "Виртуальный DOM",
        "Встроенная база данных",
      ],
      correctAnswer: [
        "Компонентный подход",
        "Одностороннее связывание данных",
        "Виртуальный DOM",
      ],
    },
    {
      id: 10,
      text: "Какая компания разработала библиотеку React?",
      type: "text",
      correctAnswer: "Facebook",
    },
    {
      id: 11,
      text: "Что такое JSX?",
      type: "single",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JSON XML",
        "JavaScript Extension",
      ],
      correctAnswer: "JavaScript XML",
    },
    {
      id: 12,
      text: "Какие методы монтирования компонента существуют в классовых компонентах React?",
      type: "multiple",
      options: [
        "constructor",
        "componentDidMount",
        "render",
        "componentShouldUpdate",
      ],
      correctAnswer: ["constructor", "componentDidMount", "render"],
    },
    {
      id: 13,
      text: "Как называется процесс преобразования JSX в JavaScript?",
      type: "text",
      correctAnswer: "transpiling",
    },
    {
      id: 14,
      text: "Что возвращает хук useState?",
      type: "single",
      options: [
        "Только значение состояния",
        "Только функцию для обновления состояния",
        "Массив из значения и функции обновления",
        "Объект с методами",
      ],
      correctAnswer: "Массив из значения и функции обновления",
    },
    {
      id: 15,
      text: "Выберите все верные утверждения о ключах (keys) в списках React:",
      type: "multiple",
      options: [
        "Должны быть уникальными среди списка",
        "Помогают React отслеживать изменения элементов",
        "Могут быть индексами массива, но это не рекомендуется",
        "Всегда должны быть числами",
      ],
      correctAnswer: [
        "Должны быть уникальными среди списка",
        "Помогают React отслеживать изменения элементов",
        "Могут быть индексами массива, но это не рекомендуется",
      ],
    },
    {
      id: 16,
      text: "Какой метод используется для обработки HTTP запросов в React?",
      type: "text",
      correctAnswer: "fetch",
    },
    {
      id: 17,
      text: "Каким образом можно передать параметры в URL в React Router?",
      type: "single",
      options: [
        "Через params",
        "Через query parameters",
        "Через state",
        "Все вышеперечисленные",
      ],
      correctAnswer: "Все вышеперечисленные",
    },
    {
      id: 18,
      text: "Выберите все правильные способы условного рендеринга в React:",
      type: "multiple",
      options: [
        "Тернарный оператор",
        "Оператор &&",
        "If-else внутри JSX",
        "Отдельная функция рендеринга",
      ],
      correctAnswer: [
        "Тернарный оператор",
        "Оператор &&",
        "Отдельная функция рендеринга",
      ],
    },
    {
      id: 19,
      text: "Как называется инструмент для создания проекта React с настроенной конфигурацией?",
      type: "text",
      correctAnswer: "Create React App",
    },
    {
      id: 20,
      text: "Какой хук используется для мемоизации вычисляемых значений?",
      type: "single",
      options: ["useState", "useEffect", "useMemo", "useCallback"],
      correctAnswer: "useMemo",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [textAnswer, setTextAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 минут в секундах
  const [testStarted, setTestStarted] = useState(false);
  const [testId, setTestId] = useState("");
  const [showResults, setShowResults] = useState(false);

  const generateTestId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  };

  useEffect(() => {
    try {
      const savedTest = localStorage.getItem("reactTest");

      if (savedTest) {
        const testData = JSON.parse(savedTest);

        const currentTime = new Date().getTime();
        const endTime = testData.startTime + testData.initialTime * 1000;

        if (currentTime < endTime) {
          setCurrentQuestion(testData.currentQuestion || 0);
          setAnswers(testData.answers || Array(questions.length).fill(null));
          setTimeLeft(Math.floor((endTime - currentTime) / 1000));
          setTestStarted(true);
          setTestId(testData.testId || generateTestId());
        } else {
          alert(
            "Отведенное на тест время истекло. Вы не можете продолжить этот тест."
          );
          localStorage.removeItem("reactTest");
          setTestId(generateTestId());
          setTestStarted(true);
        }
      } else {
        setTestId(generateTestId());
        setTestStarted(true);
      }
    } catch (e) {
      console.error("Ошибка при загрузке данных теста:", e);
      setTestId(generateTestId());
      setTestStarted(true);
    }
  }, []);

  useEffect(() => {
    if (testStarted && testId) {
      try {
        const testData = {
          testId,
          currentQuestion,
          answers,
          startTime: new Date().getTime() - (30 * 60 - timeLeft) * 1000,
          initialTime: 30 * 60, // 30 минут в секундах
        };
        localStorage.setItem("reactTest", JSON.stringify(testData));
      } catch (e) {
        console.error("Ошибка при сохранении данных теста:", e);
      }
    }
  }, [testStarted, testId, currentQuestion, answers, timeLeft]);

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            alert("Время истекло! Тест завершен.");
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
  }, [currentQuestion, answers]);

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
      percentage: Math.round((correctAnswers / questions.length) * 100),
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

        {/* Обзор результатов */}
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

  return (
    <>
      {!showResults ? (
        <div className="test-container">
          <h1 className="test-title">Тест по React</h1>

          {/* Таймер */}
          <div className="timer-container">
            <div className={`timer ${timeLeft < 300 ? "warning" : ""}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Навигация по вопросам */}
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

          {/* Текущий вопрос */}
          {renderQuestion()}

          {/* Навигационные кнопки */}
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

          {/* Статистика прогресса */}
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
