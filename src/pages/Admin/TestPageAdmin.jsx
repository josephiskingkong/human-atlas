import React, { useState, useRef } from "react";
import QuestionsList from "../../components/Testing/QuestionsList";
import NewQuestion from "../../components/Testing/NewQuestion";
import { useNotification } from "../../context/NotificationContext";

import "../../styles/layout/test-page-admin.css";

const TestPageAdmin = () => {
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "single",
    options: ["", ""],
    correctOptionIndex: 0,
    correctOptionIndexes: [],
    textAnswers: [""], // Множественные текстовые ответы
  });
  const newQuestionRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const dragNode = useRef(null);
  const { showNotification } = useNotification();

  const handleTitleChange = (e) => {
    setTestTitle(e.target.value);
  };

  const handleQuestionTextChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      text: e.target.value,
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    });
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, ""],
    });
  };

  const removeOption = (index) => {
    if (newQuestion.options.length <= 2) {
      return; // Минимум 2 варианта ответа
    }

    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    let correctOptionIndex = newQuestion.correctOptionIndex;

    if (
      index === correctOptionIndex ||
      correctOptionIndex >= updatedOptions.length
    ) {
      correctOptionIndex = 0;
    }

    let correctOptionIndexes = [...newQuestion.correctOptionIndexes];
    if (correctOptionIndexes.includes(index)) {
      correctOptionIndexes = correctOptionIndexes.filter((i) => i !== index);
    }

    correctOptionIndexes = correctOptionIndexes.map((i) =>
      i > index ? i - 1 : i
    );

    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
      correctOptionIndex: correctOptionIndex,
      correctOptionIndexes: correctOptionIndexes,
    });
  };

  const setCorrectOption = (index) => {
    setNewQuestion({
      ...newQuestion,
      correctOptionIndex: index,
    });
  };

  const toggleCorrectOption = (index) => {
    let updatedIndexes = [...newQuestion.correctOptionIndexes];

    if (updatedIndexes.includes(index)) {
      updatedIndexes = updatedIndexes.filter((i) => i !== index);
    } else {
      updatedIndexes.push(index);
    }

    setNewQuestion({
      ...newQuestion,
      correctOptionIndexes: updatedIndexes,
    });
  };

  const handleQuestionTypeChange = (type) => {
    setNewQuestion({
      ...newQuestion,
      type,
    });
  };

  const addTextAnswer = () => {
    setNewQuestion({
      ...newQuestion,
      textAnswers: [...newQuestion.textAnswers, ""],
    });
  };

  const removeTextAnswer = (index) => {
    if (newQuestion.textAnswers.length <= 1) {
      return;
    }

    const updatedAnswers = newQuestion.textAnswers.filter(
      (_, i) => i !== index
    );
    setNewQuestion({
      ...newQuestion,
      textAnswers: updatedAnswers,
    });
  };

  const handleTextAnswersChange = (index, value) => {
    const updatedAnswers = [...newQuestion.textAnswers];
    updatedAnswers[index] = value;
    setNewQuestion({
      ...newQuestion,
      textAnswers: updatedAnswers,
    });
  };

  const addQuestion = () => {
    if (!newQuestion.text.trim()) {
      showNotification("Пожалуйста, заполните текст вопроса", "info");
      return;
    }

    if (newQuestion.type === "single" || newQuestion.type === "multiple") {
      if (newQuestion.options.some((option) => !option.trim())) {
        showNotification("Пожалуйста, заполните все варианты ответов", "info");
        return;
      }

      if (
        newQuestion.type === "multiple" &&
        newQuestion.correctOptionIndexes.length === 0
      ) {
        showNotification(
          "Пожалуйста, выберите хотя бы один правильный вариант ответа",
          "info"
        );
        return;
      }
    } else if (
      newQuestion.type === "text" &&
      newQuestion.textAnswers.every((answer) => !answer.trim())
    ) {
      showNotification(
        "Пожалуйста, укажите хотя бы один правильный текстовый ответ",
        "info"
      );
      return;
    }

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = { ...newQuestion };
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, { ...newQuestion }]);
    }

    resetForm();
  };

  const resetForm = () => {
    setNewQuestion({
      text: "",
      type: "single",
      options: ["", ""],
      correctOptionIndex: 0,
      correctOptionIndexes: [],
      textAnswers: [""],
    });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    resetForm();
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));

    if (editingIndex === index) {
      cancelEditing();
    }
  };

  const startEditing = (index) => {
    const questionToEdit = questions[index];

    const editableQuestion = {
      text: questionToEdit.text || "",
      type: questionToEdit.type || "single",
      options: [...(questionToEdit.options || ["", ""])],
      correctOptionIndex:
        questionToEdit.correctOptionIndex !== undefined
          ? questionToEdit.correctOptionIndex
          : 0,
      correctOptionIndexes: [...(questionToEdit.correctOptionIndexes || [])],
      textAnswers: [
        ...(questionToEdit.textAnswers || [questionToEdit.textAnswer || ""]),
      ],
    };

    setNewQuestion(editableQuestion);
    setEditingIndex(index);

    setTimeout(() => {
      if (newQuestionRef.current) {
        newQuestionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const moveQuestion = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= questions.length) {
      return;
    }

    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);

    setQuestions(updatedQuestions);

    if (editingIndex === fromIndex) {
      setEditingIndex(toIndex);
    } else if (editingIndex === toIndex) {
      setEditingIndex(fromIndex);
    }
  };

  const handleArrowMove = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    moveQuestion(index, targetIndex);
  };

  const handleDragStart = (e, index) => {
    dragNode.current = e.target;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();

    if (draggedIndex !== null && index !== draggedIndex) {
      moveQuestion(draggedIndex, index);
    }

    setDraggedIndex(null);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    setDraggedIndex(null);
  };

  return (
    <div className="test-wrapper">
      <button className="button-back">Назад</button>
      <h1>Создание теста</h1>
      <label className="category">Категория (тема)</label>
      <div className="test">
        <div className="title-test-wrapper">
          <input
            className="input-title"
            type="text"
            value={testTitle}
            onChange={handleTitleChange}
            placeholder="Введите название теста"
          />
          <input type="time" className="input-duration"></input>
        </div>
        <QuestionsList
          questions={questions}
          onEdit={startEditing}
          onRemove={removeQuestion}
          onMove={handleArrowMove}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
        <NewQuestion
          question={newQuestion}
          newQuestionRef={newQuestionRef}
          isEditing={editingIndex !== null}
          editingIndex={editingIndex}
          onQuestionTextChange={handleQuestionTextChange}
          onQuestionTypeChange={handleQuestionTypeChange}
          onOptionChange={handleOptionChange}
          onSetCorrectOption={setCorrectOption}
          onToggleCorrectOption={toggleCorrectOption}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onTextAnswersChange={handleTextAnswersChange}
          onAddTextAnswer={addTextAnswer}
          onRemoveTextAnswer={removeTextAnswer}
          onSubmit={addQuestion}
          onCancel={cancelEditing}
        />
        <button
          className="button-save"
          disabled={!testTitle || questions.length === 0}
        >
          Сохранить тест
        </button>
      </div>
    </div>
  );
};

export default TestPageAdmin;
