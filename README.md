# Calendar
Simple calendar for saving events or tasks.

### Functionality:
1. Adding tasks (by click on calendar cell or from string written
                in new event popup).
2. Deleting tasks.
3. Editable tasks.
4. Searching tasks by title.
5. All tasks saves in local storage.

### Adding event from string (new event popup):
1. Date and time are required.
2. Date can be set in diferent formats: 
- day - one or two digits;
- month - two digits or string (full name);
- year - two or four digits (optional);
- date can be separated with single spaces, '-' and '/'.
3. Time can be set in 'H:mm' or 'HH:mm' format.
4. Order of information are not important.
5. Event name can be any string without separators (commas, dots etc) and except participants format.
6. Participants (optional) can be add in the format 'Name Surname' separated by commas.

---
For using and testing calendar do 
```npm install``` and ```gulp build``` in console, 
and then run index.html.
