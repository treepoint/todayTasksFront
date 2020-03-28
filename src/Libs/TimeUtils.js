//Преобразуем минуты в читаемый вид
export function getTimeFromMins(mins) {
  if (mins < 0) {
    return "--:--";
  }

  if (mins === null) {
    return "00:00";
  } else {
    let hours = Math.trunc(mins / 60);
    let minutes = mins % 60;

    if (minutes <= 9) {
      minutes = "0" + minutes;
    }

    if (hours <= 9) {
      hours = "0" + hours;
    }

    return hours + ":" + minutes;
  }
}

//Получить разницу во времени между двумя отформатированными временами. Типа 23:12 - 22:01
export function diffBetweenFormateTime(firstTime, secondTime) {
  let firstHour = Number.parseInt(firstTime.substring(0, 2));
  let firstMinutes = Number.parseInt(firstTime.substring(3, 5));
  let secondHour = Number.parseInt(secondTime.substring(0, 2));
  let secondMinutes = Number.parseInt(secondTime.substring(3, 5));

  let resultHour = Math.abs(firstHour - secondHour);
  let resultMinutes = Math.abs(firstMinutes - secondMinutes);

  if (resultMinutes <= 9) {
    resultMinutes = "0" + resultMinutes;
  }

  if (resultHour <= 9) {
    resultHour = "0" + resultHour;
  }

  return resultHour + ":" + resultMinutes;
}

export function getCurrentFormatDate() {
  let date = new Date();

  return getFormatDate(date);
}

export function getFormatDate(date) {
  var formatDate = new Date(date);
  var dd = String(formatDate.getDate()).padStart(2, "0");
  var mm = String(formatDate.getMonth() + 1).padStart(2, "0");
  var yyyy = formatDate.getFullYear();

  return yyyy + "-" + mm + "-" + dd;
}

export function getRussianFormatDate(date) {
  var russianFormatDate = new Date(date);
  var dd = String(russianFormatDate.getDate()).padStart(2, "0");
  var mm = String(russianFormatDate.getMonth() + 1).padStart(2, "0");
  var yyyy = russianFormatDate.getFullYear();

  return dd + "." + mm + "." + yyyy;
}

//Получить текущее время, форматированное
export function getCurrentTimeFormat() {
  //Получим сегодняшную дату
  var date = new Date();

  var mm = date.getMinutes();
  var hh = date.getHours();

  if (mm < 10) {
    mm = "0" + mm;
  }

  return hh + "-" + mm;
}

//Получить текущую дату и время, форматированное
export function getCurrentDateWithTimeFormat() {
  return getCurrentFormatDate() + " " + getCurrentTimeFormat();
}

export function getCurrentDayName() {
  var date = new Date();

  return getShortDayNameByID(date.getDay());
}

export function getShortDayNameByID(id) {
  switch (id) {
    case 1:
      return "ПН";
    case 2:
      return "ВТ";
    case 3:
      return "СР";
    case 4:
      return "ЧТ";
    case 5:
      return "ПТ";
    case 6:
      return "СБ";
    case 0:
      return "ВС";
    default:
      return;
  }
}

export function getDDbyDate(date) {
  return String(date.getDate()).padStart(2, "0");
}

export function getMMbyDate(date) {
  return String(date.getMonth() + 1).padStart(2, "0");
}

export function revokeDays(date, count) {
  let offsetDate = new Date(date);

  return offsetDate.setDate(offsetDate.getDate() - count);
}

export function addDays(date, count) {
  let offsetDate = new Date(date);

  return offsetDate.setDate(offsetDate.getDate() + count);
}

export function getFirstDayOfCurrentMonth() {
  var date = new Date();
  var yyyy = date.getFullYear();
  var mm = String(date.getMonth() + 1).padStart(2, "0");

  date = new Date(yyyy, mm - 1, 1);

  return date;
}

export function getLastDayOfCurrentMonth() {
  var date = new Date();
  var yyyy = date.getFullYear();
  var mm = String(date.getMonth() + 1).padStart(2, "0");

  date = new Date(yyyy, mm, 0);

  return date;
}

export function getFirstDayOfPreviousMonth() {
  var date = new Date();
  var yyyy = date.getFullYear();
  var mm = String(date.getMonth() + 1).padStart(2, "0");

  date = new Date(yyyy, mm - 2, 1);

  return date;
}

export function getLastDayOfPreviousMonth() {
  var date = new Date();
  var yyyy = date.getFullYear();
  var mm = String(date.getMonth() + 1).padStart(2, "0");

  date = new Date(yyyy, mm - 1, 0);

  return date;
}

export function getFirstDayOfCurrentWeek() {
  //Получим текущую дату
  let currentDate = new Date();

  if (currentDate.getDay() === 0) {
    return revokeDays(currentDate, 6);
  } else {
    return revokeDays(currentDate, currentDate.getDay() - 1);
  }
}

export function getLastDayOfCurrentWeek() {
  //Получим текущую дату
  let currentDate = new Date();

  if (currentDate.getDay() === 0) {
    return currentDate;
  } else {
    return addDays(currentDate, 7 - currentDate.getDay());
  }
}

//Получимть сегодня в JS формате, нужно для redux
export function getToday() {
  let today = new Date();
  return today;
}
