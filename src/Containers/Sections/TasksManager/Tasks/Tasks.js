import React from "react";
//Подключаем redux
import { connect } from "react-redux";
import { fetchTasksByDate } from "../../../../Store/actions/tasks";
//Компоненты
import Task from "../../../../Components/Task/Task";
import AddTaskButton from "../../../../Components/AddTaskButton/AddTaskButton";
//CSS
import "./Tasks.css";

class Tasks extends React.Component {
  componentDidMount() {
    this.props.fetchTasksByDate(this.props.date);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      this.props.fetchTasksByDate(this.props.date);
    }
  }

  shouldComponentUpdate(prevProps) {
    //Если задачи не получены — нечего рисовать
    if (this.props.tasksIsFetching) {
      return false;
    }

    //Но если задачи получили, отрисуем только если состояние поменялось
    if (prevProps.tasks !== this.props.tasks) {
      return true;
    } else {
      //Иначе чекнем, что либо категории либо статусы поменялись
      if (
        prevProps.taskStatuses !== this.props.taskStatuses ||
        prevProps.categories !== this.props.categories
      ) {
        return true;
      }
    }

    //И если глобальные настройки поменялись — тоже перерендерим
    if (prevProps.isAllMinimize !== this.props.isAllMinimize) {
      return true;
    }

    //Иначе — не рендерим
    return false;
  }

  //Категории по задаче
  getCategoriesByTask(task) {
    //Соберем список категорий
    let categoriesList = [];

    const categories = this.props.categories;

    for (var c in categories) {
      //Добавляем если категория активна, или эта категория проставлена у задачи
      if (
        categories[c].close_date === null ||
        categories[c].id === task.category_id
      ) {
        categoriesList.push({
          value: categories[c].id,
          label: categories[c].name,
          style: categories[c].name_style
        });
      }
    }

    //Соберем контент для селекта категорий с указанием текущей
    return { list: categoriesList, current: task.category_id };
  }

  //Статусы по задаче
  getStatusesByTask(task) {
    //Соберем список статусов
    let statusesList = [];

    let taskStatuses = this.props.taskStatuses;

    for (var ts in taskStatuses) {
      //Добавляем если статус активен, или этот статус проставлен у задачи
      if (
        taskStatuses[ts].close_date === null ||
        taskStatuses[ts].id === task.status_id
      ) {
        statusesList.push({
          value: taskStatuses[ts].id,
          label: taskStatuses[ts].name,
          style: taskStatuses[ts].name_style
        });
      }
    }

    //Соберем контент для селекта статусов с указанием текущего
    return { list: statusesList, current: task.status_id };
  }

  //Соберем таблицу для отображения задач
  getTasks() {
    let content = [];
    const tasks = this.props.tasks;
    let tasksForChosenDate = {};

    //Отфильтруем за нужную дату. Так же проверим, что таск не перенесен
    for (var ts in tasks) {
      if (tasks[ts].for_date === this.props.date) {
        tasksForChosenDate[tasks[ts].id] = tasks[ts];
      }
    }

    //Если задачи еще не загружены — ничего не делаем
    if (this.props.tasksIsFetching) {
      return null;
    }

    //Если же уже загрузили, но задач 0 — отобразим заглушку
    if (
      !this.props.tasksIsFetching &&
      Object.keys(tasksForChosenDate).length === 0
    ) {
      return (
        <div className="task">
          <div className="tasksNotExistsMessage">
            <p className="tasksNotExistsMessage p">Задачи не найдены.</p>
            <p className="tasksNotExistsMessage p">
              {" "}
              Выберите другую дату или добавьте новую задачу.
            </p>
          </div>
        </div>
      );
    }

    //Если задачи есть — соберем их
    for (var t in tasksForChosenDate) {
      //Отфильтруем в зависимости от того, смотрим мы по архиву или нет
      if (
        (tasksForChosenDate[t].in_archive === 0 && !this.props.isArchive) ||
        (tasksForChosenDate[t].in_archive === 1 && this.props.isArchive)
      ) {
        content.push(
          <Task
            date={this.props.date}
            content={{
              id: tasksForChosenDate[t].id,
              statuses: this.getStatusesByTask(tasksForChosenDate[t]),
              name: tasksForChosenDate[t].name,
              name_style: tasksForChosenDate[t].name_style,
              categories: this.getCategoriesByTask(tasksForChosenDate[t]),
              execution_time_day: tasksForChosenDate[t].execution_time_day,
              execution_time_all: tasksForChosenDate[t].execution_time_to_day,
              in_archive: tasksForChosenDate[t].in_archive,
              on_fire: tasksForChosenDate[t].on_fire,
              moved_date: tasksForChosenDate[t].moved_date
            }}
          />
        );
      }
    }

    //И вернем
    return content;
  }

  getAddTaskButton() {
    return <AddTaskButton date={this.props.date} />;
  }

  render() {
    return (
      <div className="taskContainer">
        {this.getTasks()}

        {/*Если это не архив — покажем кнопку добавления тасков*/ !!!this.props
          .isArchive
          ? this.getAddTaskButton()
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks,
    tasksIsFetching: state.tasksIsFetching,
    taskStatuses: state.taskStatuses,
    categories: state.categories
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTasksByDate: date => {
      dispatch(fetchTasksByDate(date));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tasks);
