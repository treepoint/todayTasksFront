import Axios from "axios";
import { APIURL } from "../Settings";

const tokens = require("./tokens.js");
const URL = APIURL + "/users";

//Получение списка пользователей как объектов в массиве
export function getUsers(callback) {
  let headers = tokens.getHeaders();

  if (headers === null) {
    return;
  }

  Axios.get(URL, headers).then(response => {
    let result = response.data;

    if (Array.isArray(result)) {
      callback(result);
    }
  });
}

//Получить пользователя по имени и паролю
export function getUserByEmailPassword(user, callback) {
  let headers = tokens.getHeaders();

  if (headers === null) {
    return;
  }

  Axios.post(URL + "/token", user, headers).then(response => {
    callback(response.data);
  });
}

//Создать пользователя
export function createUser(user, callback) {
  if (typeof user !== "object") {
    return false;
  }

  //Роль по умолчанию — пользователь, вторая
  let newUser = Object.assign(user, { role_id: 2 });

  Axios.post(URL + "/registration", newUser, tokens.getHeaders())
    .then(response => {
      if (typeof response.data.insertId === "number") {
        callback(response);
      }
    })
    .catch(error => {
      callback(error);
    });
}

//Удалить пользователя
export function deleteUser(ID, callback) {
  let headers = tokens.getHeaders();

  if (headers === null) {
    return;
  }

  Axios.delete(URL + "/" + ID, headers)
    .then(response => {
      if (typeof response.data.affectedRows === "number") {
        callback(true);
      }
    })
    .catch(error => {
      callback(false);
    });
}
