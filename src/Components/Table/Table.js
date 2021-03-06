import React from "react";
//Подключаем компоненты
import Row from "./Row/Row";
//CSS
import "./Table.css";

class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      colsDescription: [],
      hidableWidth: 0,
    };
  }

  componentDidMount() {
    this.setColsWidth(this.props.children);
  }

  setColsWidth(table) {
    let width = 0;

    //Соберем массив, описывающий столбцы
    let colsDescription = table[0].map((column) => {
      //Если есть описание — получим данные оттуда. Иначе — стандартные
      try {
        return {
          //Текущая, ну или начальная ширина
          width: column.width,
          minWidth: column.minWidth,
          type: column.type,
        };
      } catch {
        return {
          width: 200,
          minWidth: 200,
          type: column.type,
        };
      }
    });

    table[0].forEach((column) => {
      if (column.hidable) {
        width += column.width;
      }
    });

    //Запишем в стейт описание столбцов
    this.setState({
      colsDescription,
      hidableWidth: width,
    });
  }

  //Подсчет ширины таблицы
  getTableWidth() {
    let tableWidth = 0;

    this.state.colsDescription.forEach((column) => {
      if (typeof column.width === "number" && column.type !== "hidden") {
        tableWidth += column.width;
      }
    });

    return tableWidth;
  }

  //Разберем контент и вернем уже объект, с которым будем работать дальше
  getObjectFromRowContent(rowContent) {
    let object = {};

    rowContent.forEach((item) => {
      switch (item.type) {
        case "hidden":
          object[item.key] = item.value;
          break;
        case "time":
          object[item.key] = item.value;
          break;
        case "string":
          object[item.key] = item.value;
          if (typeof item.style !== "undefined") {
            object[item.key + "_style"] = item.style;
          }
          break;
        case "text":
          object[item.key] = item.value;
          if (typeof item.style !== "undefined") {
            object[item.key + "_style"] = item.style;
          }
          break;
        case "select":
          object[item.key] = item.value.current;
          break;
        default:
          return;
      }
    });

    return object;
  }

  saveRow(rowContent) {
    //Если не функция — ничего делать не будем. Значит её не передали
    if (typeof this.props.saveRow !== "function") {
      return;
    }

    //Соберем объект из строки
    let object = this.getObjectFromRowContent(rowContent);

    //Отправим на сохранение в ДБ
    this.props.saveRow(object);
  }

  deleteRow(rowContent) {
    let object = this.getObjectFromRowContent(rowContent);

    this.props.deleteRow(object);
  }

  archiveRow(rowContent) {
    let object = this.getObjectFromRowContent(rowContent);

    this.props.archiveRow(object);
  }

  dearchiveRow(rowContent) {
    let object = this.getObjectFromRowContent(rowContent);

    this.props.dearchiveRow(object.id);
  }

  getHeader() {
    //Если шапки нет — вернем ничего
    if (this.props.isHeaderless) {
      return null;
    }

    //Иначе вернем шапку
    return (
      <Row
        key={0}
        //Закрепляем таблицу
        isFixed={this.props.isFixed}
        //Ширина таблицы
        tableWidth={this.getTableWidth()}
        //Ширина скрываемых столбцов
        hidableWidth={this.state.hidableWidth}
        //Указываем, на наличие шапки. По умолчанию — есть
        isHeader={true}
        //Передадим содержимое столбцов из шапки
        rowsContent={this.props.children[0]}
        //Так же передадим описание столбцов — ширину и подобное
        colsDescription={this.state.colsDescription}
        addRow={!!this.props.addRow ? () => this.props.addRow() : null}
      />
    );
  }

  getNoDataMessage() {
    return (
      <div className="tableNotFoundMessage">
        {!!this.props.notFoundMessage
          ? this.props.notFoundMessage
          : "Нет записей для отображения."}
      </div>
    );
  }

  getContent() {
    const table = this.props.children;

    //Если контента нет — выведем предварительно подготовленное сообщение
    if (
      (this.props.isHeaderless && table.length === 0) ||
      (!this.props.isHeaderless && table.length === 1)
    ) {
      return this.getNoDataMessage();
    }

    //Соберем тушку для отрисовки
    let content = table.map((row, index) => {
      //Если есть шапка — её рисуем в другом месте
      if (!this.props.isHeaderless && index === 0) {
        return null;
      }

      return (
        <Row
          key={index}
          //Закрепляем таблицу
          isFixed={this.props.isFixed}
          //Ширина таблицы
          tableWidth={this.getTableWidth()}
          //Ширина скрываемых столбцов
          hidableWidth={this.state.hidableWidth}
          //Говорим, что это шапка
          isHeader={false}
          //Передадим содержимое столбцов из шапки
          rowsContent={row}
          //Так же передадим описание столбцов — ширину и подобное
          colsDescription={this.state.colsDescription}
          //Обработчики действий
          saveRow={(rowContent) => this.saveRow(rowContent, index)}
          deleteRow={
            !!this.props.deleteRow
              ? (rowContent) => this.deleteRow(rowContent)
              : null
          }
          archiveRow={
            !!this.props.archiveRow
              ? (rowContent) => this.archiveRow(rowContent)
              : null
          }
          dearchiveRow={
            !!this.props.dearchiveRow
              ? (rowContent) => this.dearchiveRow(rowContent)
              : null
          }
        />
      );
    });

    return content;
  }

  render() {
    return (
      <div className="tableWrapper" style={{ maxHeight: this.props.maxHeight }}>
        <div className="table">
          {this.getHeader()}
          {this.getContent()}
        </div>
      </div>
    );
  }
}

export default Table;
