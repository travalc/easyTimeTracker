// Tab functionality
var formButton = document.getElementById("formButton");
var logButton = document.getElementById("logButton");
var formTab = document.getElementById("trackingForm");
var logTab = document.getElementById("timeLog");
formButton.disabled = true;
formButton.addEventListener("click", function() {
    formTab.style.display = "block";
    logTab.style.display = "none";
}, false);
logButton.addEventListener("click", function() {
    logTab.style.display = "block";
    formTab.style.display = "none";
}, false);

// Record data functionality
var weeks = [];
var submitWeek = document.getElementById("submitWeek");
submitWeek.addEventListener("click", function() { //Submission event
    var week = {
        "entries": [],
    };

    function addEntry(day, startTime, endTime) { //adds day entry to week array
        var startInputValue = document.getElementById(startTime).value;
        var endInputValue = document.getElementById(endTime).value;

        function getTotal(time1, time2) { //gets total time per day entry
            var total;
            var parsedTime1 = Date.parse(time1);
            var parsedTime2 = Date.parse(time2);
            var totalInMilliseconds = parsedTime2 - parsedTime1;
            var totalInMinutes = totalInMilliseconds / 60000;
            total = (Math.floor(totalInMinutes / 60)) + ((totalInMinutes % 60) / 60);
            return total;
        }

        function formatDate(time) {
            var slicedYear = time.slice(0, 4);
            var slicedMonthAndDay = time.slice(5, 10).replace("-", "/");
            var formattedDate = slicedMonthAndDay + "/" + slicedYear;
            return formattedDate;
        }

        function formatTime(time) {
            var slicedTime = time.slice(11);
            var timeOfDay;
            var slicedHour = slicedTime.slice(0, 2);
            var numHour = Number(slicedHour);
            var finalNumHour;
            if (numHour < 12) {
                timeOfDay = "AM";
                if (numHour < 1) {
                    finalNumHour = 12;
                } else {
                    finalNumHour = numHour;
                }
            } else if (numHour >= 12) {
                timeOfDay = "PM";
                switch (numHour) {
                    case 12:
                        finalNumHour = 12;
                        break;
                    case 13:
                        finalNumHour = 01;
                        break;
                    case 14:
                        finalNumHour = 02;
                        break;
                    case 15:
                        finalNumHour = 03;
                        break;
                    case 16:
                        finalNumHour = 04;
                        break;
                    case 17:
                        finalNumHour = 05;
                        break;
                    case 18:
                        finalNumHour = 06;
                        break;
                    case 19:
                        finalNumHour = 07;
                        break;
                    case 20:
                        finalNumHour = 08;
                        break;
                    case 21:
                        finalNumHour = 09;
                        break;
                    case 22:
                        finalNumHour = 10;
                        break;
                    case 23:
                        finalNumHour = 11;
                }
            }
            var finalStringHour = finalNumHour.toString();
            var finalMinutes = slicedTime.slice(3);
            var finalTime = finalStringHour + ":" + finalMinutes + " " + timeOfDay;
            return finalTime;
        }
        var totalHours = getTotal(startInputValue, endInputValue);
        var dayEntry = {
            "day": day,
            "start": startInputValue,
            "end": endInputValue,
            "formattedStartDate": formatDate(startInputValue),
            "formattedStartTime": formatTime(startInputValue),
            "formattedEndDate": formatDate(endInputValue),
            "formattedEndTime": formatTime(endInputValue),
            "totalHours": totalHours
        };
        if (totalHours > 0) { //add entry only if entered hours are more than 0
            week["entries"].push(dayEntry);
        }
    }
    //Gather all input info in an array
    var dayParameterArray = [
        ["Monday", "monStartTime", "monEndTime"],
        ["Tuesday", "tuesStartTime", "tuesEndTime"],
        ["Wednesday", "wedStartTime", "wedEndTime"],
        ["Thursday", "thuStartTime", "thuEndTime"],
        ["Friday", "friStartTime", "friEndTime"],
        ["Saturday", "satStartTime", "satEndTime"],
        ["Sunday", "sunStartTime", "sunEndTime"]
    ];
    for (var i = 0, len = dayParameterArray.length; i < len; i++) {
        addEntry(dayParameterArray[i][0], dayParameterArray[i][1], dayParameterArray[i][2]); //apply addEntry function to each day
    }

    function getTotalForWeek(arr) { //sum hours of all day entries
        var total = 0;
        for (var i = 0, len = arr.length; i < len; i++) {
            total += arr[i].totalHours;
        }
        return total;
    }
    week.totalForWeek = getTotalForWeek(week.entries);
    if (week["entries"].length > 0) { //adds week entry to weeks array only if day entries are present
        weeks.push(week);
    }
    var inputs = document.querySelectorAll("input");
    for (var k = 0, leng = inputs.length; k < leng; k++) { //reset input fields
        inputs[k].value = undefined;
    }
}, false);


// Logging functionality
var timeLogAll = document.getElementById("flexLog");
logButton.addEventListener("click", function() {

    function logWeek() { // Adds weekly entry to log

        for (var i = 0, len = weeks.length; i < len; i++) {
            var weekEntry = buildWeek(weeks[i]);

            timeLogAll.appendChild(weekEntry);
        }
    }

    function buildWeek(week) { // Constructs weekly entry
        var weekDiv = document.createElement("div");
        weekDiv.className = "week";
        var weekSummary = document.createElement("div");
        weekSummary.className = "weekComponents";
        weekSummary.setAttribute("id", "weekSummary");
        var weekTitle = document.createElement("h4");
        weekTitle.className = "weekSummaryComponent";
        var weekTitleText = document.createTextNode("Week of " + week["entries"][0].formattedStartDate + " - " + week["entries"][week["entries"].length - 1].formattedEndDate);
        weekTitle.appendChild(weekTitleText);
        var weekTotal = document.createElement("h4");
        weekTotal.className = "weekSummaryComponent";
        var weekTotalText = document.createTextNode(" Total Hours: " + week.totalForWeek);
        weekTotal.appendChild(weekTotalText);
        weekSummary.appendChild(weekTitle);
        weekSummary.appendChild(weekTotal);
        var weekEntries = document.createElement("div");
        weekEntries.className = "weekComponents";
        weekEntries.setAttribute("id", "weekEntries");

        for (var i = 0, len = week["entries"].length; i < len; i++) {
            buildDay(week["entries"][i]);
        }

        function buildDay(day) { // Construct each daily entry
            var dailyEntry = document.createElement("div");
            dailyEntry.className = "detailedDayEntry";
            var totalForDay = document.createElement("h5");
            var totalForDayText = document.createTextNode("Total: " + day.totalHours);
            totalForDay.appendChild(totalForDayText);
            var dateOfEntry = document.createElement("h5");
            var dateOfEntryText = document.createTextNode(week.entries[i].day + " " + day.formattedStartDate);
            dateOfEntry.appendChild(dateOfEntryText);
            var timesOfEntry = document.createElement("h5");
            var timesOfEntryText = document.createTextNode(week.entries[i].formattedStartTime + " - " + day.formattedEndTime);
            timesOfEntry.appendChild(timesOfEntryText);
            dailyEntry.appendChild(dateOfEntry);
            dailyEntry.appendChild(timesOfEntry);
            dailyEntry.appendChild(totalForDay);
            switch (day.day) {
                case "Monday":
                    dailyEntry.classList.add("gray-background");
                    break;
                case "Tuesday":
                    dailyEntry.classList.add("blue-background");
                    break;
                case "Wednesday":
                    dailyEntry.classList.add("orange-background");
                    break;
                case "Thursday":
                    dailyEntry.classList.add("purple-background");
                    break;
                case "Friday":
                    dailyEntry.classList.add("green-background");
                    break;
                case "Saturday":
                    dailyEntry.classList.add("red-background");
                    break;
                case "Sunday":
                    dailyEntry.classList.add("yellow-background");
            }
            weekEntries.appendChild(dailyEntry);
        }
        weekDiv.appendChild(weekSummary);
        weekDiv.appendChild(weekEntries);
        return weekDiv;
    }

    logWeek();
    logButton.disabled = true;
    formButton.disabled = !formButton.disabled;
}, false);

formButton.addEventListener("click", function() {
    timeLogAll.innerHTML = "";
    logButton.disabled = !logButton.disabled;
    formButton.disabled = true;
}, false);
