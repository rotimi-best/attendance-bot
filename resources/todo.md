# PROJECT TODO

## FUNCTIONALITIES

### Group

    - newgroup - create a new group (with students)
    - mygroups - edit a group
    - rename - change a group's name
    - addstudent - add student(s) to a group
    - deletegroup - delete a group

### Attendance

    - newattendance - take a class attendance
    - viewattendance - view group register
    - editattendance - repeat attendance

### Spreadsheet

    - createspreadsheet - create new Spreadsheet
    - newsheetadd - new sheet to Spreadsheet
    - lastinsertedattendance - get last inserted column
    - uploadattendancepush - new attendance into sheet for a particular group

### Documentation

    - write - write readme doc for project

## IMPLEMENTATION

1. newgroup
   - Make a form
   - ask for name of the group
   - ask for students name, they must me seperated by commas
   - get the result of form and add a owner object with 2 fields, name and telegram id
   - Save this in the database
