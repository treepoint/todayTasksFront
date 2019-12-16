import React from "react";
import NavigationLink from "./NavigationLink/NavigationLink";
//CSS
import "./Navigation.css";

class Navigation extends React.Component {
  render() {
    return (
      <div className="navigation">
        <NavigationLink to="/working" value="Задачи" />
        <NavigationLink to="/about" value="Справка" />
        <NavigationLink to="/admin" value="Админ.панель" onlyAdmin={true} />
      </div>
    );
  }
}

export default Navigation;
