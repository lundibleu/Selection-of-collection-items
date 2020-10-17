/**
 * @param {Array} collection
 * @params {Function[]} – Функции для запроса
 * @returns {Array}
 */

// Функция с заданными операциями
function query() {

	var copyCol = JSON.parse(JSON.stringify(arguments[0])); // копия коллекции
	var numOpr = arguments.length - 1; // количество операций над коллекцией
	var propList = Object.keys(copyCol[0]); // список имен свойств объектов

	// отсортированный объект (сначала операции filterIn, потом select)
	var sortArguments = [].slice.call(arguments).slice(1).sort((a, b) => a[0][0] > b[0][0] ? 1 : -1);

	// Функция для удаления null и undefined элементов из массива
	function toClean(obj, index) {
		return  obj !== undefined && obj !== null; 
	}

	// Функция для получения имен свойств для удаления
	function chooseToDel(elem) {
		return !fields.includes(elem);
	}

	// Функция для получения имен свойств, которые надо оставить
	function toDelPropName(elem) {
		return fields.includes(elem);
	}

	// Функция для удаления свойства из объекта
	function toDelProp(obj, index) {
		for(let i = 0; i < toDel.length; i++) {
			delete obj[toDel[i]];
		}
		return obj;
	}

	// Функция для фильтрации выбранных свойств
	function toFilterProp(obj, index) {
		if (fieldsVal.indexOf(obj[field]) == -1) {
			return null;
		} else {
			return obj;
		}
	}

	if (numOpr > 0) {

		// Проверка операций
		for (let i = 0; i < numOpr; i++) {
			if (sortArguments[i][0] == 'select') {
				var fields = [].slice.call(sortArguments[i][1]); // Cписок имен выбранных свойств
				var toDel = propList.filter(chooseToDel); // Список имен свойств, которые надо удалить
				
				propList = propList.filter(toDelPropName);
				copyCol = copyCol.map(toDelProp);

			} else if(sortArguments[i][0] == 'filterIn') {
				var field = ([].slice.call(sortArguments[i][1]))[0]; // Имя свойства для фильтрации
				var fieldsVal = ([].slice.call(sortArguments[i][1]))[1]; // Список возможных значений свойств

				copyCol = copyCol.map(toFilterProp).filter(toClean);
			}
		}
	}
	return copyCol;
}

// Получаем выбранные поля объектов для select
// @params {String[]}
function select() {
	return ['select', arguments];
}

// Получаем правила фильтрации объектов для filterIn
// @param {String} property – Свойство для фильтрации
// @param {Array} values – Массив разрешённых значений
function filterIn(property, values) {
	return ['filterIn', arguments];
}

module.exports = {
    query: query,
    select: select,
    filterIn: filterIn
};
