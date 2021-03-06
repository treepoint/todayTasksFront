//Обвязка для API
import { APIURL, getHeaders } from "../APIConfiguration";
import Axios from "axios";
import { fetchTasksByDate, setTasks } from "./tasks";
import { setNotifications } from "./notifications";
import { getCurrentTimeFormat } from "../../Libs/TimeUtils";

const URL = APIURL + "/tasks_log";

export const SET_TASKS_LOG = "SET_TASKS_LOG";
export const IS_TASKS_LOG_UPDATING = "IS_TASKS_LOG_UPDATING";
export const REMOVE_TASK_LOG = "REMOVE_TASK_LOG";
export const CLEAR_TASKS_LOG = "CLEAR_TASKS_LOG";

export function setTasksLog(object) {
  return { type: SET_TASKS_LOG, object };
}

export function setIsUpdating(boolean) {
  return { type: IS_TASKS_LOG_UPDATING, boolean };
}

export function clearTasksLog(object) {
  return { type: CLEAR_TASKS_LOG, object };
}

//Получить весь лог выполнения за определенный период
export function fetchTasksLogByDate(date) {
  return dispatch => {
    let headers = getHeaders();

    if (headers === null) {
      return;
    }

    Axios.get(URL + "/date/" + date, headers)
      .then(response => {
        dispatch(setTasksLog(response.data));
        dispatch(fetchTasksByDate(date));
      })
      .catch(error => {
        let message =
          "Не удалось получить лог выполнения задач. Перезагрузите страницу и попробуйте снова.";
        dispatch(setNotifications({ message, type: "error" }));
      });
  };
}

//Создать лог
export function createTaskLog(taskId, date) {
  return dispatch => {
    let headers = getHeaders();

    if (headers === null) {
      return;
    }

    let taskLog = {
      task_id: taskId,
      comment: "",
      execution_start: date + " " + getCurrentTimeFormat(),
      execution_end: date
    };

    Axios.post(URL, taskLog, headers)
      .then(response => {
        if (typeof response.data === "object") {
          //К нему добавим новый объект и обновим список
          dispatch(setTasksLog(response.data));
        }
      })
      .catch(error => {
        let message =
          "Не удалось добавить запись в лог. Перезагрузите страницу и попробуйте снова.";
        dispatch(setNotifications({ message, type: "error" }));
      });
  };
}

//Обновить лог
export function updateTaskLog(taskLog, forDate) {
  return (dispatch, getState) => {
    dispatch(setIsUpdating(true));

    let headers = getHeaders();

    if (headers === null) {
      return;
    }

    //При обновлении лога обновляем и время исполнения соответствующей задачи
    const state = getState();

    let oldTaskLog = state.tasksLog[taskLog.id];
    let task = state.tasks[taskLog.task_id];

    Axios.put(URL + "/" + taskLog.id, taskLog, headers)
      .then(response => {
        if (typeof response.data === "object") {
          //Новое время исполнения за день
          let newExecutionTime =
            response.data[Object.keys(response.data)[0]].execution_time;
          //Получим разницу
          let changeTime = newExecutionTime - oldTaskLog.execution_time;
          //Если есть задача (а может не быть, если перенесена не будущее) — обновим время исполнения
          if (!!task) {
            task.execution_time_day = task.execution_time_day + changeTime;
            task.execution_time_to_day =
              task.execution_time_to_day + changeTime;

            //Соберем таск в требуемый вид
            task = { [taskLog.task_id]: task };
            //Обновим таск
            dispatch(setTasks(task));
          }

          let newTaskLog = response.data;
          //Проставим дату за которую считаем лог
          newTaskLog[Object.keys(newTaskLog)[0]].for_date = forDate;
          //Обновим лог
          dispatch(setTasksLog(newTaskLog));
          dispatch(setIsUpdating(false));
        }
      })
      .catch(error => {
        let message =
          "Не удалось обновить запись в логе. Перезагрузите страницу и попробуйте снова.";
        dispatch(setNotifications({ message, type: "error" }));
        dispatch(setIsUpdating(false));
      });
  };
}

//Обновить название задачи в логе задач
//Нужно, если задача переименовывается, но при этом она есть в логе
export function updateTaskNameInLog(taskId) {
  return (dispatch, getState) => {
    //Получим текущее состояние
    const state = getState();

    //Вытащим оттуда лог
    let tasksLog = state.tasksLog;
    //Вытащим оттуда задачу с таким названием
    let task = state.tasks[taskId];

    //Пройдемся по всем записям в логе
    for (var tl in tasksLog) {
      //Найдем записи по этой задача
      if (tasksLog[tl].task_id === task.id) {
        //Получим этот лог полностью
        let newTaskLog = null;
        newTaskLog = tasksLog[tl];

        //Обновим там имя задачи
        newTaskLog.task_name = task.name;

        //Обновим лог
        dispatch(setTasksLog(newTaskLog));
      }
    }
  };
}

//Удалить лог
export function deleteTaskLog(id) {
  return (dispatch, getState) => {
    let headers = getHeaders();

    if (headers === null) {
      return;
    }

    const state = getState();

    //При удалении лога нужно вычесть его время из задачи во фронте. Но если этой задачи нет — вычитать нечего
    let taskLog = state.tasksLog[id];
    let task = state.tasks[taskLog.task_id];

    if (typeof task !== "undefined") {
      //Получаем время исполнения таска
      let executionTimeDay = task.execution_time_day;
      let executionTimeToDay = task.execution_time_to_day;

      //Вычитаем время выполнения из лога
      task.execution_time_day = executionTimeDay - taskLog.execution_time;
      task.execution_time_to_day = executionTimeToDay - taskLog.execution_time;

      //Соберем таск в требуемый вид
      task = { [taskLog.task_id]: task };
    }

    Axios.delete(URL + "/" + id, headers)
      .then(response => {
        if (typeof response.data.affectedRows === "number") {
          //Обновим таск, если он еще существует
          if (typeof task !== "undefined") {
            dispatch(setTasks(task));
          }

          //Удалим объект и обновим список
          dispatch(removeTaskLog(id));
        }
      })
      .catch(error => {
        let message =
          "Не удалось удалить запись из лога. Перезагрузите страницу и попробуйте снова.";
        dispatch(setNotifications({ message, type: "error" }));
      });
  };
}

export function removeTaskLog(id) {
  return { type: REMOVE_TASK_LOG, id };
}
