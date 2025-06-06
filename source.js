/**
 * Мапа сопоставления месяца к числовому значению
 */
const monthMap = {
  января: "01",
  февраля: "02",
  марта: "03",
  апреля: "04",
  мая: "05",
  июня: "06",
  июля: "07",
  августа: "08",
  сентября: "09",
  октября: "10",
  ноября: "11",
  декабря: "12",
  "янв.": "01",
  "фев.": "02",
  "мар.": "03",
  "апр.": "04",
  "мая.": "05",
  "июн.": "06",
  "июл.": "07",
  "авг.": "08",
  "сен.": "09",
  "окт.": "10",
  "ноя.": "11",
  "дек.": "12",
};

/**

* Парсер даты
* 
* @param dateStr строка со временем
*
* @returns отформатированная строка yyyy-mm-dd
* @returns null
*/
function parseDate(dateStr) {
  if (!dateStr) return null;
  for (const reg of dateRegExpParsers) {
    const parsedDate = reg(dateStr);
    if (parsedDate) {
      return parsedDate;
    }
  }
  return null;
}

/**
 * Массив функций, находящие ДЕНЬ, МЕСЯЦ, ГОД в строке, возвращая отформатированную дату
 *
 * @returns отформатированная строка yyyy-mm-dd
 * @returns undefined
 */
const dateRegExpParsers = [
  (str) => {
    const match = str.match(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/); // формат dd-mm-yyyy
    if (match) {
      return toDateFormat(match[3], match[2], match[1]);
    }
  },
  (str) => {
    const match = str.match(/(\d{4})[\.\-\/](\d{2})[\.\-\/](\d{2})/); // формат yyyy-mm-dd
    if (match) {
      return toDateFormat(match[1], match[2], match[3]);
    }
  },
  (str) => {
    const match = str.match(/["«]?(\d{1,2})["»]? ([А-я]+\.?) (\d{4})/); // формат с буквенными месяцами yyyy-mm-dd (англ. названий нет)
    if (match) {
      return toDateFormat(match[3], monthMap[match[2]], match[1]);
    }
  },
  (str) => {
    const match = str.match(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/);
    if (match) {
      return toDateFormat(match[3], match[2], match[1]);
    }
  },
];

/**
 * Парсер в ISO8601
 *
 * @param dateStr строка со временем
 *
 * @returns отформатированная строка yyyy-mm-ddTHH:MM:SS.XXX(+H:MM | Z)
 * @returns null
 */
function parseToISO(dateStr) {
  if (!dateStr) return null;
  const parsedDate = parseDate(dateStr);
  if (!parsedDate) return null;
  const stamp = parseTime(dateStr);
  const timezone = parseTimeZone(dateStr);
  return parsedDate + stamp + timezone;
}

/**
 * Форматер даты yyyy-mm-dd
 *
 * @param year год
 * @param month месяц
 * @param day день
 *
 * @returns отформатированная строка yyyy-mm-dd
 */
function toDateFormat(year, month, day) {
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Форматер времени THH-MM-SS.XXX
 *
 * @param hours год
 * @param minutes месяц
 * @param ms день
 *
 * @returns отформатированная строка THH:MM:SS.XXX
 */
function toTimeFormat(
  hours = "00",
  minutes = "00",
  seconds = "00",
  ms = "000"
) {
  return `T${hours.padStart(2, "0")}:${minutes.padStart(
    2,
    "0"
  )}:${seconds.padStart(2, "0")}.${ms.padStart(3, "0")}`;
}

/**
 * Парсер временной зоны
 *
 * @param dateStr строка со временем
 *
 * @returns отформатированная строка +H:MM | Z
 * @returns null
 */
function parseTimeZone(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/\+\d{1,2}:00/);
  return match ? match[0] : "Z";
}

/**
 * Парсер времени
 *
 * @param dateStr строка со временем
 *
 * @returns отформатированная строка THH:MM:SS.XXX
 * @returns null
 */
function parseTime(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
  if (!match) {
    const time = dateStr.match(
      /(?:(?:T|\s|\+|;)\s*)?(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?/
    );
    if (!time || time[0].startsWith("+")) return toTimeFormat();

    return toTimeFormat(time[1], time[2], time[3], time[4]);
  }

  return toTimeFormat(match[1], match[2], match[3], match[4]);
}

module.exports = function ({ src, options }) {
  return parseToISO(src[options]);
};
