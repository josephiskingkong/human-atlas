import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HintMenu from "./HintMenu";
import { editPoint } from "../../../../hooks/points/editPoint";
import {
  setCurrMenu,
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
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import { useNotification } from "../../../../context/NotificationContext";

export default function PointMenu() {
  const targetPoint = useSelector((state) => state.atlas.targetPoint);
  const dispatch = useDispatch();

  const { showNotification } = useNotification();

  const [titlePoint, setTitlePoint] = useState("");
  const [infoPoint, setInfoPoint] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [activeButton, setActiveButton] = useState("markdown");

  const textArea = useRef(null);

  useEffect(() => {
    setTitlePoint(targetPoint.name);
    setInfoPoint(targetPoint.description);
  }, [targetPoint]);

  const saveHandler = async () => {
    let id = targetPoint.id;
    let title = titlePoint;
    let description = infoPoint;

    if (title) {
      console.log(title + " " + description);

      editPoint({ id, name: title, description });

      const newPoint = {
        ...targetPoint,
        id,
        name: title,
        description,
      };

      dispatch(setTargetPoint({ ...newPoint }));
      console.log(newPoint);

      dispatch(setCurrMenu("close"));

      showNotification("Точка успешно обновлена", "info");
    } else {
      showNotification("У точки должно быть название", "error");
    }
  };

  const delPoint = async () => {
    await deletePointById(targetPoint.id);

    dispatch(setTargetPoint({ id: targetPoint.id, status: "del" }));
    dispatch(setCurrMenu("close"));

    showNotification("Точка успешно удалена", "info")
  };

  const closeModal = () => {
    setIsDelModalOpen(false);
  };

  const textAreaHandler = (event) => {
    const textarea = textArea.current;
  
    if (!isFocus || !textarea) return;
  
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = infoPoint.slice(start, end);
  
    const isBoldShortcut = (event.ctrlKey || event.metaKey) && event.code === "KeyB";
    const isItalicShortcut = (event.ctrlKey || event.metaKey) && event.code === "KeyI";
    const isUnderlineShortcut = (event.ctrlKey || event.metaKey) && event.code === "KeyU";
  
    if (isBoldShortcut) {
      event.preventDefault();
      setInfoPoint(
        `${infoPoint.slice(0, start)}**${selectedText}**${infoPoint.slice(end)}`
      );
    } else if (isItalicShortcut) {
      event.preventDefault();
      setInfoPoint(
        `${infoPoint.slice(0, start)}*${selectedText}*${infoPoint.slice(end)}`
      );
    } else if (isUnderlineShortcut) {
      event.preventDefault();
      setInfoPoint(
        `${infoPoint.slice(0, start)}<u>${selectedText}</u>${infoPoint.slice(end)}`
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
        message="Вы уверены, что хотите удалить точку?"
        actionName="Удалить"
        actionColor="red"
      />

      {isFocus && <HintMenu />}

      <div className="point-menu-container">
        <input
          type="text"
          className="input-title"
          value={titlePoint}
          onChange={(event) => setTitlePoint(event.target.value)}
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
                <Markdown>{infoPoint}</Markdown>
              </div>
            ) : (
              <textarea
                type="text"
                className="input-info"
                ref={textArea}
                value={infoPoint}
                onChange={(event) => setInfoPoint(event.target.value)}
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
          <button
            className="del-button"
            onClick={() => setIsDelModalOpen(true)}
          >
            Удалить
          </button>
        </div>
      </div>
    </>
  );
}
