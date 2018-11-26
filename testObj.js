let obj = {
    "events": [{
    "id": 1,
    "title": "Stand-up",
    "date": "10-05-2018 10:00",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 2,
    "title": "Stand-up",
    "date": "11-05-2018 10:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 3,
    "title": "Stand-up",
    "date": "12-06-2018 10:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 4,
    "title": "Stand-up",
    "date": "13-05-2018 10:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 5,
    "title": "Stand-up",
    "date": "14-06-2018 10:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 6,
    "title": "Stand-up",
    "date": "15-05-2018 10:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 7,
    "title": "Stand-up",
    "date": "16-06-2018 08:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 8,
    "title": "Stand-up",
    "date": "17-05-2018 08:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 9,
    "title": "Stand-up",
    "date": "18-06-2018 08:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}, {
    "id": 10,
    "title": "Stand-up",
    "date": "19-05-2018 08:40",
    "participants": [{
        "id": 1,
        "name": "Витя",
        "surname": "Костин"
    }, {
        "id": 2,
        "name": "Дима",
        "surname": "Молодцов"
    }]
}]
};
localStorage.setItem('events', JSON.stringify(obj));
/*
let timeRegExp = /(\d{1,2}):(d{2})/;

let dateRegExp1 = /(\d{1,2}) [а-я]{3,}/;

let partisipentsRegExp = /[А-Я][а-я]+ [А-Я][а-я]+/g;

const dateRegExp = /(\b[0-2]?\d|3[0-1])(?: |-|\/)([А-Яа-я]{3,}|0\d|1[0-2])(?:(?: |-|\/)(\d{4}\b))?/;*/
// regExp matches date format (from match()):
// date (D)D [1]
// month MM, MMMM [2]
// year YY(YY) optional [3]
// date can be separated with ' ', -, /
// don't return from match() separators (' ', -, /)
// if year does'n set - last element of array - undefined
// not checking february or months with 30 days in