import React from "react";
import TimeField from "react-simple-timefield";
import "./TimeContent.css";

class TimeContent extends React.Component {
  onChange(event) {
    this.props.onChangeTimeContent(event.target.value);
  }

  //Получаем стиль ячейки заголовка на основании стиля контента
  getStyle() {
    let style;

    if (!!this.props.isHeader) {
      style = {
        width: this.props.width - 7 + "px",
        height: this.props.height - 2 + "px",
        fontWeight: "900",
        background: "rgb(224, 224, 224)",
        color: "#000"
      };
    } else {
      style = {
        width: this.props.width - 6 + "px",
        height: this.props.height - 2 + "px",
        fontWeight: "200"
      };
    }

    return style;
  }

  render() {
    return (
      <TimeField
        value={this.props.timeContent}
        disabled={!!this.props.disabled ? true : false}
        className="timeContent"
        style={this.getStyle()}
        onChange={event => this.onChange(event)}
      />
    );
  }
}

export default TimeContent;
