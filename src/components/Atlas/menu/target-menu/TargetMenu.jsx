import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HintMenu from "./HintMenu";
import { editPoint } from "../../../../hooks/points/editPoint";
import {
  setCurrMenu,
  setSlideDetails,
  setTargetPoint,
} from "../../../../redux/atlas/atlas-slice";
import { deletePointById } from "../../../../hooks/points/deletePoint";
import pencil from "../../../../assets/images/pencil.svg";
import pencilBlue from "../../../../assets/images/pencil-blue.svg";
import eye from "../../../../assets/images/eye.svg";
import eyeBlue from "../../../../assets/images/eye-blue.svg";
import Markdown from "../../../Common/Markdown";
import ButtonIcon from "./ButtonIcon";
import "../../../../styles/components/menu/point-menu.css";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import { useNotification } from "../../../../context/NotificationContext";
import editSlide from "../../../../hooks/organs/edit";

export default function TargetMenu({ isSlide = false }) {
  const target = useSelector((state) =>
    isSlide ? state.atlas.slideDetails : state.atlas.targetPoint
  );
  const dispatch = useDispatch();

  const { showNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [info, setInfo] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [activeButton, setActiveButton] = useState("markdown");

  const textArea = useRef(null);

  useEffect(() => {
    setTitle(target.name);

    if (!target.description) {
      setInfo("");
      return;
    }

    setInfo(target.description);
  }, [target]);

  const saveHandler = async () => {
    let id = target.id;
    let titleTemp = title;
    let description = info;

    if (titleTemp) {
      if (isSlide) {
        editSlide(id, titleTemp, description, target.categoryId);

        dispatch(
          setSlideDetails({
            id,
            name: titleTemp,
            description,
          })
        );

        showNotification(
          "Слайд успешно обновлен (для корректного отображения изменений перезагрузите страницу)",
          "info"
        );
      } else {
        editPoint({ id, name: titleTemp, description });

        const newPoint = {
          ...target,
          id,
          name: titleTemp,
          description,
        };

        dispatch(setTargetPoint({ ...newPoint }));

        dispatch(setCurrMenu("close"));

        showNotification("Точка успешно обновлена", "info");
      }
    } else {
      showNotification(
        isSlide
          ? "У слайда должно быть название"
          : "У точки должно быть название",
        "error"
      );
    }
  };

  const delPoint = async () => {
    await deletePointById(target.id);

    dispatch(setTargetPoint({ id: target.id, status: "del" }));
    dispatch(setCurrMenu("close"));

    showNotification("Точка успешно удалена", "info");
  };

  const closeModal = () => {
    setIsDelModalOpen(false);
  };

  const textAreaHandler = (event) => {
    const textarea = textArea.current;

    if (!isFocus || !textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = info.slice(start, end);

    const isBoldShortcut =
      (event.ctrlKey || event.metaKey) && event.code === "KeyB";
    const isItalicShortcut =
      (event.ctrlKey || event.metaKey) && event.code === "KeyI";
    const isUnderlineShortcut =
      (event.ctrlKey || event.metaKey) && event.code === "KeyU";

    if (isBoldShortcut) {
      event.preventDefault();
      setInfo(`${info.slice(0, start)}**${selectedText}**${info.slice(end)}`);
    } else if (isItalicShortcut) {
      event.preventDefault();
      setInfo(`${info.slice(0, start)}*${selectedText}*${info.slice(end)}`);
    } else if (isUnderlineShortcut) {
      event.preventDefault();
      setInfo(
        `${info.slice(0, start)}<u>${selectedText}</u>${info.slice(end)}`
      );
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isDelModalOpen}
        onClose={closeModal}
        onConfirm={delPoint}
        title="Подтвердите удаление"
        message={
          isSlide
            ? "Вы уверены, что хотите удалить слайд?"
            : "Вы уверены, что хотите удалить точку?"
        }
        actionName="Удалить"
        actionColor="red"
      />

      {isFocus && <HintMenu />}

      <div className="point-menu-container">
        <input
          type="text"
          className="input-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        ></input>
        <div className="textarea-container">
          <div className="view-info-buttons">
            <ButtonIcon
              alt={"markdown"}
              isActive={activeButton === "markdown"}
              onClick={() => {
                setActiveButton("markdown");
                setIsMarkdown(true);
              }}
            >
              {activeButton === "markdown" ? pencil : pencilBlue}
            </ButtonIcon>
            <ButtonIcon
              alt={"view"}
              isActive={activeButton === "view"}
              onClick={() => {
                setActiveButton("view");
                setIsMarkdown(false);
              }}
            >
              {activeButton === "view" ? eye : eyeBlue}
            </ButtonIcon>
          </div>
          <div className="input-info-container">
            {!isMarkdown ? (
              <div className="markdown-wrapper">
                <Markdown>{info}</Markdown>
              </div>
            ) : (
              <textarea
                type="text"
                className="input-info"
                ref={textArea}
                value={info}
                onChange={(event) => setInfo(event.target.value)}
                onKeyDown={textAreaHandler}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
              />
            )}
          </div>
        </div>
        <div className="point-info-buttons">
          <button className="save-button" onClick={saveHandler}>
            Сохранить
          </button>
          {!isSlide && (
            <button
              className="del-button"
              onClick={() => setIsDelModalOpen(true)}
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </>
  );
}
