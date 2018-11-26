/**
 * Calendar
 */

'use strict';

let eventsObject = localStorage.getItem('events') ?
    JSON.parse(localStorage.getItem('events')) : {events: []};

const prevButton = document.querySelector('.prevDate');
const nextButton = document.querySelector('.nextDate');

const allPopUpElements = document.querySelectorAll('.popup');
const calendar = document.querySelector('.calendar__row');
const popup = document.querySelector('.calendar__popup');
const title = popup.querySelector('.calendar__popup__title');
const date = popup.querySelector('.calendar__popup__date');
const timeField = popup.querySelector('.calendar__popup__time');
const participants = popup.querySelectorAll('.calendar__popup__part')[1];
const description = popup.querySelector('.calendar__popup__description');
const descrInput = document.querySelector('.calendar__popup__descr');
const timeInput = popup.querySelector('.calendar__popup__timeInput');
const editBtn = document.querySelector('#edit');
const titleInput = popup.querySelector(".titleInput");

const particInput = popup.querySelector(".particInput");
const currentMonth = document.querySelector('.nav__date');
const searchInput = document.querySelector('.search__input');
const searchHelper = document.querySelector('.search-match');
const searchContent = searchHelper.querySelector('.search-match__content');

const deleteBtn = document.querySelector('#delete');
const saveBtn = document.querySelector('#save');

const newEventInput = document.querySelector('.new-event__input');
const calendarCols = document.querySelectorAll(`.calendar__col`);

let element;

class EventItem {
    constructor(id, title, date, participants, description) {
        this.id = id + 1;
        this.title = title;
        this.date = date;
        this.participants = [].concat(participants);
        if (description) this.description = description;
    }
}

String.prototype.capitalize = function () {
    return this[0].toUpperCase() + this.slice(1);
};

/**
 * @description Function that builds calendar page depends on month and existing events
 * @param date {Object} date object created with moment.js
 * @param obj {Object} saved events if exists
 */

function createCalendar(date, obj) {
    window.location.hash = date.format('MM-YYYY');
    currentMonth.textContent = `${date.format('MMMM YYYY').capitalize()}`;
    let fullDate = date.date(1);
    let weekDay = date.day();
    let callendarDay = date.subtract(weekDay, 'days');

    Array.prototype.forEach.call(calendarCols, function (col) {
        while (col.firstChild) col.removeChild(col.firstChild)
    });

    for (let i = 0; i < 35; i++) {
        callendarDay.add(1, 'days');
        let weekDayIndex = callendarDay.day() - 1 >= 0 ? callendarDay.day() - 1 : 6;
        let contentArr = [];

        if (obj.events.length) {
            obj.events.forEach(function (item) {
                if (item.date.split(' ')[0] === fullDate.format('DD-MM-YYYY')) {
                    contentArr.push(item);
                }
            });
        }

        calendarCols[weekDayIndex].appendChild(!calendarCols[weekDayIndex].firstChild ?
            createCell(callendarDay.format('dddd, D').capitalize(), contentArr) :
            createCell(callendarDay.date(), contentArr));
    }
}

/**
 * @description Function generates calendar cell
 * @param date {String} string with date to append in cell
 * @param content {Object} saved event
 * @returns {HTMLDivElement} event or empty calendar cell
 */
function createCell(date, content) {
    const calendarCell = document.createElement('div');
    const day = document.createElement('p');
    day.textContent = date;
    day.className = 'calendar__cell__date';
    calendarCell.appendChild(day);
    calendarCell.classList.add('calendar__cell');

    if (content) {
        content.forEach(function (item) {
            calendarCell.appendChild(addCellContent(item));
            calendarCell.classList.add('calendar__cell_ev');
        });

    }
    return calendarCell;
}

/**
 * @description Function generates content block from event object
 * @param cont {Object} saved event
 * @returns {HTMLDivElement} event content block;
 */
function addCellContent(cont) {
    const contentBox = document.createElement('div');
    const eventTitle = document.createElement('h6');
    const participants = document.createElement('p');

    eventTitle.textContent = cont.title;
    participants.textContent = cont.participants.map(function (person) {
        return `${person.name} ${(person.surname ? person.surname : '')}`;
    }).join(', ');

    contentBox.appendChild(eventTitle);
    contentBox.appendChild(participants);

    return contentBox;
}

/**
 * @description Function convert text date to date object
 * @returns {Object}
 */
function getSettedDate() {
    return moment(document.querySelector('.nav__date').textContent, "MMMM YYYY");
}

/**
 * @description Function make visible event popup by clicking on calendar cell
 * @param event
 */
function eventPopupByClick(event) {
    element = event.target.closest('.calendar__cell');
    showEventPopup(element);
    event.stopPropagation();
}

/**
 * @description Function manage event popup window
 * @param element
 */
function showEventPopup(element) {
    element.classList.add('clicked');
    element.closest('.calendar__col').firstChild.classList.add('checked-day');
    choosePosition(element);
    fillPopup(element);

    popup.classList.remove('hidden');
    element.children.length > 1
        ? deleteBtn.removeAttribute('disabled')
        : deleteBtn.setAttribute('disabled', '');

    deleteBtn.addEventListener('click', saveRemoveBtnHandler);
    saveBtn.addEventListener('click', saveRemoveBtnHandler);
    calendar.removeEventListener('click', eventPopupByClick);
    document.body.addEventListener('click', bodyClickHandler);
}

/**
 * @description Handler for save and delete button.
 * Save or delete event depends on button. Validate title input
 * @param event
 */
function saveRemoveBtnHandler(event) {

    let settedTime = timeField.textContent
        ? timeField.textContent
        : timeInput.value || '10:00';
    let checkedDate = moment(`${correctTargetDate(element)} ${settedTime}`, 'D MMMM YYYY HH:mm');

    if (element.children.length > 1) {
        eventsObject.events.forEach((item, index) => {

            if (checkedDate.format('DD-MM-YYYY HH:mm') === item.date) {
                if (event.target === deleteBtn) {
                    eventsObject.events.splice(index, 1);
                    updateAndRebuild(getSettedDate());
                }
                if (event.target === saveBtn && title.classList.contains('hidden')) {
                    inputValidatorAndManager(titleInput, editEventItem(item));
                }
            }
        })
    } else {
        let eventArr = [
            checkedDate,
            titleInput.value,
            particInput.value,
            descrInput.value
        ];
        inputValidatorAndManager(titleInput, newEvent(eventArr));
    }
}

/**
 * @description function validate title input and run callback
 * @param {HTMLInputElement} input - input for validation
 * @param {Function} fn - callback
 */
function inputValidatorAndManager(input, fn) {
    if (input.value && typeof fn === 'function') {
        input.classList.remove('danger');
        input.parentElement.removeChild(input.previousElementSibling);
        fn();
        updateAndRebuild(
            input === newEventInput
                ? moment(eventsObject.events[eventsObject.events.length - 1].date, "DD-MM-YYYY HH:mm")
                : getSettedDate()
        );
    } else {
        input.classList.add('danger');
        let validationAlert = document.createElement('p');
        validationAlert.textContent = input.classList.contains('new-event__input')
        ? 'Пустое поле или неверный формат'
        : 'Нельзя создать задачу без названия';
        validationAlert.className = 'validation-alert';
        input.parentElement.insertBefore(validationAlert, input);
    }
}

/**
 * @description callback for new event item
 * @param {Array} array
 * @returns {Function || Boolean}
 */
function newEvent(array) {
    if (array.length) {
        let [date, title, participants, description] = array;
        return function () {
            eventsObject.events.push(new EventItem(
                eventsObject.events.length,
                title,
                date.format('DD-MM-YYYY HH:mm'),
                parsePartisipants(participants),
                description
            ));
        }
    }
    return false;
}

/**
 * @description callback for edit eventItem
 * @param {Object} eventItem
 * @returns {Function}
 */
function editEventItem(eventItem) {
    return function () {
        eventItem.title = popup.querySelector('.titleInput').value;
        eventItem.participants = eventItem.participants.length
            ? parsePartisipants(popup.querySelector('.particInput').value)
            : [];

        eventItem.date = moment(
            `${date.textContent} ${(currentMonth.textContent.split(/ /)[1])} ${timeInput.value}`,
            "D MMMM YYYY HH:mm"
        ).format("DD-MM-YYYY HH:mm");

        eventItem.description = document.querySelector('.calendar__popup__descr').value || '';
    }
}

/**
 * @description Function hiding event popup and updating calendar
 */
function updateAndRebuild(dateObj) {
    fixObjectId(eventsObject.events);
    localStorage.setItem('events', JSON.stringify(eventsObject));
    clearAndHide();
    saveBtn.removeEventListener('click', saveRemoveBtnHandler);
    deleteBtn.removeEventListener('click', saveRemoveBtnHandler);
    createCalendar(dateObj, eventsObject);
}

/**
 * @description Function correcting events id in eventsObj
 * @param {Array} arr
 */
function fixObjectId(arr) {
    arr.forEach((elem, i) => {
        elem.id = i + 1;
    })
}

/**
 * @description Function hiding popup window
 */
function hide() {
    Array.prototype.forEach.call(allPopUpElements, function (popupElement) {
        if (!popupElement.classList.contains('hidden')) {
            popupElement.classList.add('hidden');
            Array.prototype.forEach.call(popupElement.children, function (innerElem) {

                if (innerElem.tagName === "INPUT" || innerElem.tagName === 'TEXTAREA') {
                    innerElem.value = '';
                    if (innerElem.classList.contains('danger')) {
                        innerElem.classList.remove('danger');
                        innerElem.parentElement.removeChild(innerElem.previousElementSibling);

                    }
                }
                if (innerElem.classList.contains('dynamic')) {
                    innerElem.textContent = '';
                }
            })
        }
    });

    document.querySelector('#addEvent').addEventListener('click', addBtnHandler);
    document.body.removeEventListener('click', bodyClickHandler);
    calendar.addEventListener('click', eventPopupByClick);
}

/**
 * @description Function hide popup and clear content
 */
function clearAndHide() {
    hide();
    Array.prototype.forEach.call(calendarCols, function (column) {
        if (column.firstElementChild.classList.contains('checked-day')) {
            column.firstElementChild.classList.remove('checked-day');
            Array.prototype.forEach.call(column.children, (cell) => {
                if (cell.classList.contains('clicked')) cell.classList.remove('clicked');
            })
        }
    })
}

/**
 * @description Function choose optimal position for event popup
 * @param target {HTMLDivElement}
 */
function choosePosition(target) {
    let arrow = document.querySelector('.arrow');
    let targetCol = target.closest('.calendar__col');
    if (Array.prototype.indexOf.call(calendarCols, targetCol) < 4) {
        popup.style.left = target.offsetLeft + target.offsetWidth + 20 + 'px';
        arrow.style.left = '-10px';
        arrow.style.transform = 'rotate(45deg)';
    } else {
        popup.style.left = target.offsetLeft - 250 - 20 + 'px';
        arrow.style.left = '240px';
        arrow.style.transform = 'rotate(-135deg)';
    }
    if (Array.prototype.indexOf.call(targetCol.children, target) < 3) {
        popup.style.top = target.offsetTop + 'px';
        popup.style.bottom = 'auto';
        arrow.style.top = '20px';
        arrow.style.bottom = 'auto'
    } else {
        popup.style.bottom = targetCol.offsetHeight - (target.offsetTop + target.offsetHeight) + 'px';
        popup.style.top = 'auto';
        arrow.style.bottom = '20px';
        arrow.style.top = 'auto'
    }
}

/**
 * @description Function generate popup content depends on clicked target
 * @param target {HTMLDivElement}
 */
function fillPopup(target) {
    // need more then one event in one date

    let checkedDate = moment(correctTargetDate(target), 'D MMMM YYYY');

    if (target.children.length > 1) {
        titleInput.classList.add('hidden');
        particInput.classList.add('hidden');
        descrInput.classList.add('hidden');
        timeInput.classList.add('hidden');

        editBtn.classList.remove('hidden');
        title.classList.remove('hidden');
        participants.classList.remove('hidden');
        description.classList.remove('hidden');
        timeField.classList.remove('hidden');

        eventsObject.events.forEach((item) => {
            if (checkedDate.format('DD-MM-YYYY') === item.date.split(' ')[0]) {
                title.textContent = item.title;
                date.textContent = moment(item.date, "DD-MM-YYYY HH:mm").format("D MMMM YYYY");
                timeField.textContent = moment(item.date, "DD-MM-YYYY HH:mm").format("HH:mm");
                participants.textContent = item.participants.map((person) => {
                    return `${person.name} ${person.surname ? person.surname : ''}`;
                }).join(', ');
                description.textContent = item.description || '';
            }
        });
        editBtn.addEventListener('click', () => {
            editBtn.classList.add('hidden');
            popupChangeFields(checkedDate);
        })
    } else {
        if (!editBtn.classList.contains('hidden')) editBtn.classList.add('hidden');
        popupChangeFields(checkedDate);
    }
}

/**
 * @description Function correcting cell date in case if target contains prev or next month date
 * @param {HTMLDivElement} target
 * @returns {string} correct date string
 */
function correctTargetDate(target) {
    let dateStr;

    if (target.closest('.calendar__col').firstChild === target &&
        target.firstElementChild.textContent.split(', ')[1] > 7) {
        dateStr = target.firstElementChild.textContent.split(', ')[1] + " " +
            moment(currentMonth.textContent, "MMMM YYYY").subtract(1, 'months').format("MMMM YYYY");
    } else if (target.closest('.calendar__col').lastChild === target &&
        target.firstElementChild.textContent < 8) {
        dateStr = target.firstElementChild.textContent + " " +
            moment(currentMonth.textContent, "MMMM YYYY").add(1, 'months').format("MMMM YYYY");
    } else {
        dateStr = `${target.firstElementChild.textContent} ${currentMonth.textContent}`;
    }
    return dateStr;
}

/**
 * @description Function show input in popup window fields for edit event
 * @param cellDate
 */
function popupChangeFields(cellDate) {

    titleInput.classList.remove('hidden');
    particInput.classList.remove('hidden');
    descrInput.classList.remove('hidden');
    timeInput.classList.remove('hidden');

    titleInput.value = title.textContent || '';
    particInput.value = participants.textContent || '';
    descrInput.value = description.textContent || '';
    date.textContent = cellDate.format('D MMMM');
    timeInput.value = timeField.textContent || '';

    title.classList.add('hidden');
    participants.classList.add('hidden');
    description.classList.add('hidden');
    timeField.classList.add('hidden');
}

/**
 * @description Function returns array of objects with participants data from string
 * @returns {{id: number, name: (*|string), surname: (*|string)}[]}
 */
function parsePartisipants(partisipantsString) {
    return partisipantsString
        ? partisipantsString
            .split(', ')
            .map((person, i) => {
                return {
                    id: i + 1,
                    name: person.split(/ /)[0],
                    surname: person.split(/ /)[1]
                }
            })
        : [];
}

/**
 * @description Function to search match title with string from input
 * @param {String} searchStr
 * @returns {Array}
 */
function searchMatch(searchStr) {
    let matchArr = [];
    let searchRegExp = new RegExp(searchStr, 'i');
    eventsObject.events.forEach((eventItem) => {
        if (searchStr && eventItem.title.match(searchRegExp)) {
            let matchContainer = document.createElement('div');
            let eventName = document.createElement('h5');
            let eventDate = document.createElement('p');
            matchContainer.className = 'search-match__container';
            eventName.textContent = eventItem.title;
            eventDate.textContent = moment(eventItem.date, 'DD-MM-YYYY HH:mm').format("D MMMM YYYY HH:mm");
            matchContainer.appendChild(eventName);
            matchContainer.appendChild(eventDate);
            matchArr.push(matchContainer);
        }
    });
    return matchArr;
}

/**
 * @description Function sets when search is using. Hide search popup if mouse
 * clicked not in input or search popup field.
 * @param event
 */
function bodyClickHandler(event) {
    if (!event.target.closest('.popup')) {
        clearAndHide();
        document.body.removeEventListener('click', bodyClickHandler);
    }
}

/**
 * @description Function to find date cell (chosen by search helper or today button)
 * and open popup with information or inputs
 * @param day {Number, String}
 */
function findDate(day) {

    searchInput.value = '';
    Array.prototype.forEach.call(calendarCols, (column) => {
        Array.prototype.forEach.call(column.children, (cell) => {
            if (day === moment(correctTargetDate(cell), "D MMMM YYYY").format("D MMMM YYYY")) {

                showEventPopup(cell);
                searchHelper.classList.add('hidden');
                document.body.addEventListener('click', bodyClickHandler);
            }

        })
    });
}

/**
 * @description Function fill search helper and add event handler to find matched event in calendar
 * @param event
 */
function searchInputHandler(event) {
    event.stopPropagation();
    while (searchContent.firstChild) {
        searchContent.removeChild(searchContent.firstChild);
    }

    if (!event.target.value && !eventsObject.events.length) return;

    searchHelper.classList.remove('hidden');
    searchMatch(event.target.value).forEach((matchItem) => {
        searchContent.appendChild(matchItem);
    });

    !searchHelper.firstElementChild
        ? searchHelper.classList.add('hidden')
        : searchContent.addEventListener('click', (event) => {
            let searchedDateStr = event.target
                .closest('.search-match__container')
                .lastElementChild
                .textContent;

            createCalendar(moment(searchedDateStr, 'DD MMMM YYYY HH:mm'), eventsObject);
            findDate(moment(searchedDateStr, 'DD MMMM YYYY HH:mm').format('D MMMM YYYY'));
        });
    document.body.addEventListener('click', bodyClickHandler);
    calendar.removeEventListener('click', eventPopupByClick);
}

/**
 * @description Function parsing string from input to array with event parameters
 * @param {String} eventString - input.value
 * @returns {*[]} [date, title, participants, description]
 */
function newEventStringParser(eventString) {
    const timeRegExp = /\b([0-1]?\d|2[0-3]):([0-5]\d)\b/;
    const dateRegExp = /(\b[0-2]?\d|3[0-1])(?: |-|\/)([А-Яа-я]{3,}|0\d|1[0-2])(?:(?: |-|\/)(\d{4}\b))?/;
    const partisipentsRegExp = /[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+/g;

    let newEventDate = eventString.match(dateRegExp);
    let newEventTime = eventString.match(timeRegExp);
    let newEventPartisipants = eventString.match(partisipentsRegExp)
        ? eventString.match(partisipentsRegExp).join(', ')
        : '';

    if (newEventDate && newEventTime) {
        let dateFormatString = 'D' + (isNaN(+newEventDate[2]) ? ' MMMM' : ' MM')
            + (newEventDate[3] ? ' YYYY' : '') + ' HH:mm';
        let newEventTitle = eventString.replace(newEventDate[0], '')
            .replace(newEventTime[0], '');

        if (newEventPartisipants) {
            newEventTitle = newEventTitle.replace(newEventPartisipants, '');
        }
        newEventTitle = newEventTitle.match(/[^ ,]+[А-ЯЁа-яё ]+/g)[0];

        let validTime = moment(
            `${newEventDate[1]} ${newEventDate[2]} ${newEventDate[3] ? newEventDate[3] : ''} ${newEventTime[0]}`,
            dateFormatString
        );

        return validTime._isValid ? [validTime, newEventTitle, newEventPartisipants, ''] : [];
    }

   // newEventInput.classList.add('danger');
    return [];
}


/**
 * @description add btn handler in new event popup
 */
function eventFromStringHandler() {

    inputValidatorAndManager(
        newEventInput,
        newEvent(newEventStringParser(newEventInput.value))
    );

}

/**
 * @description new event btn handler
 * @param event
 */
function addBtnHandler(event) {
    event.stopPropagation();
    document.querySelector('#addEvent').removeEventListener('click', addBtnHandler);
    document.querySelector('.new-event').classList.remove('hidden');
    document.body.addEventListener('click', bodyClickHandler);
    calendar.removeEventListener('click', eventPopupByClick);
    document.querySelector('.new-event__btn').addEventListener('click', eventFromStringHandler)
}

window.onload = function () {
    let dateString = window.location.hash.slice(1, window.location.hash.length) || '';
    dateString
        ? createCalendar(moment(dateString, "MM-YYYY"), eventsObject)
        : createCalendar(moment(), eventsObject);

    searchInput.addEventListener('keyup', searchInputHandler);
    searchInput.addEventListener('click', searchInputHandler);

    prevButton.addEventListener('click', () => {
        createCalendar(getSettedDate().subtract(1, 'months'), eventsObject);
    });
    nextButton.addEventListener('click', () => {
        createCalendar(getSettedDate().add(1, 'months'), eventsObject);
    });
    calendar.addEventListener('click', eventPopupByClick);
    document.querySelector('#addEvent').addEventListener('click', addBtnHandler);
    document.querySelector('.popup-close').addEventListener('click', clearAndHide);
    document.querySelector('.today').addEventListener('click', (e) => {
        e.stopPropagation();
        createCalendar(moment(), eventsObject);
        findDate(moment().format("D MMMM YYYY"));
    });

    document.querySelector("#refresh").addEventListener('click', () => {
        window.location.reload();
    });

    document.querySelector('.new-event__close').addEventListener('click', hide);
};
