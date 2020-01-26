import React from "react";
//Подключаем роутинг
import { Switch, Route } from "react-router-dom";
//Подключаем redux
import { connect } from "react-redux";
import { restoreFromCookies } from "../../Store/actions/app";
//Подключаем модальные окна
import { getGlobalModalWindow } from "../../Components/GlobalModalWindow/GLOBAL_MODAL_WINDOWS";
//Подключаем компоненты и контейнеры
import Header from "../Header/Header";
import Home from "../Sections/Home/Home";
import TasksManager from "../Sections/TasksManager/TasksManager";
import TaskStatuses from "../Sections/TaskStatuses/TaskStatuses";
import Categories from "../Sections/Categories/Categories";
import StatisticRouter from "../Sections/Statistic/StatisticRouter";
import About from "../Sections/About/About";
import AdminPanelRouter from "../Sections/AdminPanel/AdminPanelRouter";
import Bottom from "../Bottom/Bottom";
//CSS
import "./App.css";

class App extends React.Component {
  componentDidMount() {
    //Пробуем подтянуть состояние приложения основываясь на информации в cookies
    this.props.restoreFromCookies();
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/tasks_manager" component={TasksManager} />
          <Route path="/task_statuses" component={TaskStatuses} />
          <Route path="/categories" component={Categories} />
          <Route path="/statistic" component={StatisticRouter} />
          <Route path="/admin" component={AdminPanelRouter} />
          <Route path="/about" component={About} />
        </Switch>
        {getGlobalModalWindow(
          this.props.modalWindowState,
          this.props.modalWindowName
        )}
        <Bottom />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    modalWindowState: state.modalWindowState,
    modalWindowName: state.modalWindowName
  };
};

const mapDispatchToProps = dispatch => {
  return {
    restoreFromCookies: () => {
      dispatch(restoreFromCookies());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
