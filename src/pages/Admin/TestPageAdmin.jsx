import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionsList from "../../components/Testing/QuestionsList";
import NewQuestion from "../../components/Testing/NewQuestion";
import { useNotification } from "../../context/NotificationContext";
import { apiRequest } from "../../config/apiRequest";
import "../../styles/layout/test-page-admin.css";
import { deleteTestById } from "../../hooks/tests/deleteTest";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";

const TestPageAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testTitle, setTestTitle] = useState("");
  // const [categoryId, setCategoryId] = useState("");
  // const [categories, setCategories] = useState([]);
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "single",
    options: ["", ""],
    correctOptionIndex: 0,
    correctOptionIndexes: [],
    textAnswers: [""],
  });
  const newQuestionRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const dragNode = useRef(null);
  const { showNotification } = useNotification();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Загрузка категорий
  // useEffect(() => {
  //   getTests().then((data) => {
  //     const uniqueCategories = [
  //       ...new Set(data.map((test) => test.categoryId)),
  //     ];
  //     const categoriesData = uniqueCategories.map((category) => {
  //       const categoryObj = data.find((test) => test.categoryId === category);
  //       return {
  //         id: category,
  //         name: categoryObj.categoryName,
  //       };
  //     });
  //     if (categoriesData.length > 0) {
  //       setCategories(categoriesData);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const test = await apiRequest(`/v1/tests/${id}`);
        setTestTitle(test.title || "");
        setDuration(test.duration || "");
        const questionsApi = await apiRequest(`/v1/tests/${id}/questions`);
        const questionsMapped = questionsApi.map((q) => {
          let options = [];
          let correctOptionIndex = 0;
          let correctOptionIndexes = [];
          let textAnswers = [];
          if (q.type === "single_choice") {
            options = q.answers.map((a) => a.text);
            correctOptionIndex = q.answers.findIndex((a) => a.isCorrect);
          } else if (q.type === "multiple_choice") {
            options = q.answers.map((a) => a.text);
            correctOptionIndexes = q.answers
              .map((a, idx) => (a.isCorrect ? idx : null))
              .filter((idx) => idx !== null);
          } else if (q.type === "text_input") {
            textAnswers = q.answers.map((a) => a.text);
          }
          return {
            text: q.text,
            type:
              q.type === "single_choice"
                ? "single"
                : q.type === "multiple_choice"
                ? "multiple"
                : "text",
            options: options.length ? options : ["", ""],
            correctOptionIndex,
            correctOptionIndexes,
            textAnswers: textAnswers.length ? textAnswers : [""],
          };
        });
        setQuestions(questionsMapped);
      } catch (e) {
        showNotification("Ошибка загрузки теста", "error");
      }
    })();
  }, [id, showNotification]);

  const mapType = (type) => {
    if (type === "single") return "single_choice";
    if (type === "multiple") return "multiple_choice";
    if (type === "text") return "text_input";
    return type;
  };

  const handleSaveTest = async () => {
    if (
      !testTitle.trim() ||
      !String(duration).trim() ||
      questions.length === 0
    ) {
      showNotification(
        "Заполните все поля и добавьте хотя бы один вопрос",
        "info"
      );
      return;
    }

    try {
      let testId = id;
      if (!id) {
        const testData = await apiRequest("/v1/tests/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: testTitle,
            duration,
          }),
        });
        testId = testData.test_id;
      } else {
        await apiRequest(`/v1/tests/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            title: testTitle,
            duration,
          }),
        });
      }

      if (id) {
        await apiRequest(`/v1/tests/${id}/questions/clear`, {
          method: "POST",
        });
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        let answers = [];
        if (q.type === "single") {
          answers = q.options.map((text, idx) => ({
            text,
            isCorrect: idx === q.correctOptionIndex,
            position: idx,
          }));
        } else if (q.type === "multiple") {
          answers = q.options.map((text, idx) => ({
            text,
            isCorrect: q.correctOptionIndexes.includes(idx),
            position: idx,
          }));
        } else if (q.type === "text") {
          answers = q.textAnswers.map((text, idx) => ({
            text,
            isCorrect: true,
            position: idx,
          }));
        }
        await apiRequest(`/v1/tests/${testId}/questions/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: q.text,
            type: mapType(q.type),
            position: i,
            answers,
          }),
        });
      }

      showNotification(
        id ? "Тест успешно обновлён!" : "Тест успешно сохранён!",
        "success"
      );

      if (!id) {
        setTestTitle("");
        setDuration("");
        setQuestions([]);
        resetForm();
      }
    } catch (e) {
      showNotification(e.message, "error");
    }
  };

  const handleDeleteTest = async () => {
    if (!id) return;

    try {
      const success = await deleteTestById(id);
      if (success) {
        showNotification("Тест успешно удалён", "success");
        navigate(-1);
      } else {
        showNotification("Не удалось удалить тест", "error");
      }
    } catch (error) {
      showNotification(error.message || "Ошибка при удалении теста", "error");
    }
  };

  const handleTitleChange = (e) => setTestTitle(e.target.value);
  const handleDurationChange = (e) => setDuration(e.target.value);

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
    if (newQuestion.options.length <= 2) return;
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
      correctOptionIndex,
      correctOptionIndexes,
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
    if (newQuestion.textAnswers.length <= 1) return;
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
    if (editingIndex === index) cancelEditing();
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
    if (toIndex < 0 || toIndex >= questions.length) return;
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
      <button className="button-back" onClick={() => navigate(-1)}>
        Назад
      </button>
      <h1>{id ? "Редактирование теста" : "Создание теста"}</h1>
      {/* <label className="category">Категория</label> */}
      {/* <select
        className="input-category"
        value={categoryId}
        onChange={handleCategoryChange}
      >
        <option value="">Выберите категорию</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select> */}
      <div className="test">
        <div className="title-test-wrapper">
          <input
            className="input-title"
            type="text"
            value={testTitle}
            onChange={handleTitleChange}
            placeholder="Введите название теста"
          />
          <div>
            <p>Длительность в минутах</p>
            <input
              type="text"
              className="input-duration"
              value={duration}
              onChange={handleDurationChange}
              placeholder="Время (в минутах)"
            />
          </div>
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
        <div className="buttons-test">
          <button
            className="button-save"
            disabled={!testTitle || !duration || questions.length === 0}
            onClick={handleSaveTest}
          >
            {id ? "Сохранить изменения" : "Сохранить тест"}
          </button>
          <button
            className="button-delete"
            disabled={!testTitle || !duration}
            onClick={() => {
              setShowConfirmModal(true);
            }}
          >
            Удалить тест
          </button>
        </div>

        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteTest}
          title="Подтвердите удаление"
          actionName="Удалить"
          actionColor="red"
          message={`Вы точно уверены, что хотите удалить тест? (Это действие нельзя отменить)`}
        />
      </div>
    </div>
  );
};

export default TestPageAdmin;
