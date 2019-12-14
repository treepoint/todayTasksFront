import React from "react";
import ContentEditable from "react-contenteditable";
import ContextMenu from "../../ContextMenu/ContextMenu";
import "./HeaderCellContent.css";

class HeaderCellContent extends React.Component {
  constructor() {
    super();
    this.state = {
      contextMenuIsHidden: true,
      isChosen: false
    };
  }

  //Изменяем контент по вводу
  onChange(event) {
    this.props.setHtmlContent(event.target.value);
  }

  //Обрабатываем изменения стиля контента в ячейке в
  //зависимости от того, что было задано в контекстном меню
  setStyle(style) {
    this.props.setStyle(style);
  }

  //Срабатывает при вызове контекстного меню
  showContextMenu(event) {
    if (!this.props.disabled) {
      event.preventDefault();
      this.setState({ contextMenuIsHidden: !this.state.contextMenuIsHidden });
    }
  }

  //Скроем контекстное меню
  setContextMenuHidden() {
    this.setState({
      contextMenuIsHidden: true
    });
  }

  //Задаем стиль ячейки на основании стиля контента
  getStyle() {
    let style;

    //Если ячейка входит в состав заголовка и заголовок не редактируемый, тогда стиль всегда один
    if (this.props.disabled) {
      style = {
        fontWeight: "900",
        width: this.props.width - 4 + "px",
        height: this.props.height - 12 + "px"
      };
    } else {
      //Иначе у нас все вариативно
      style = {
        marginLeft: !!this.state.isChosen
          ? -this.props.scrollLeft + "px"
          : 0 + "px",
        width: this.props.width - 5 + "px",
        height: this.props.height - 12 + "px",
        background: this.props.style.backgroundColor,
        fontWeight: !!this.props.style.bold ? "900" : "200",
        fontStyle: !!this.props.style.italic ? "italic" : "normal"
      };
    }

    return style;
  }

  //Срабатывает при потере фокуса
  setDefaultClassName() {
    this.setState({
      isChosen: false
    });
  }

  //Срабатывает при двойном клике
  setChosenClassName() {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      className: true,
      contextMenuIsHidden: true
    });
  }

  render() {
    //Контекстное меню рисуем только если нужно
    let contextMenu;

    if (!this.state.contextMenuIsHidden) {
      contextMenu = (
        <ContextMenu
          className={this.state.contextMenuClassName}
          cellStyle={this.props.style}
          scrollLeft={this.props.scrollLeft}
          setContextMenuHidden={event => this.setContextMenuHidden(event)}
          setCellStyle={style => this.setStyle(style)}
        />
      );
    }

    return (
      <div>
        {contextMenu}

        <ContentEditable
          spellCheck="false"
          className={
            !!this.state.isChosen
              ? "headerCellContent chosen"
              : "headerCellContent"
          }
          style={this.getStyle()}
          //Задаем контент
          html={this.props.htmlContent}
          //Задаем редактируемость
          disabled={this.props.disabled}
          onChange={event => this.onChange(event)}
          //Обрабатываем двойной клик
          onDoubleClick={event => this.setChosenClassName(event)}
          //При уходе фокуса задаем стандартный стиль. Нужно чтобы сбросить последствия двойного клика
          onBlur={event => this.setDefaultClassName(event)}
          //Обрабатываем контекстное меню
          onContextMenu={event => this.showContextMenu(event)}
        ></ContentEditable>
      </div>
    );
  }
}

export default HeaderCellContent;
