let taskInput = document.querySelector("#taskName");
let taskDate = document.querySelector("#taskDate");
let taskTime = document.querySelector("#taskTime")
let taskForm = document.querySelector("#taskForm");
let taskEditForm = document.querySelector("#taskEditForm");
let loaderBox = document.querySelector("table-wrap");
let deleteBtn = document.querySelector(".delete-btn");
let deleteAllBtn = document.querySelector(".delete-all-btn");
let unique = NaN;
let modalPopupParagraph = document.querySelector(".common-modal p");
let commonModal = document.querySelector(".overlay");
let tableRow = document.querySelectorAll(".tr");
let taskDescription = document.querySelector("#taskDescription");
let notificationText = document.querySelector(".task-completed-box p");
const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function displayModal(message) {
    modalPopupParagraph.innerHTML = message;
    deleteAllBtn.addEventListener("click", function () {
        document.querySelector('.overlay').classList.toggle("active");
    });
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(allTask));
}

function addTask() {
    let taskInputValue = taskInput.value;
    let taskDateObj = new Date(taskDate.value)
    let taskDayValue = day[taskDateObj.getDay()];
    let taskDateValue = taskDateObj.getDate();
    console.log(taskDateObj)
    let taskMonthValue = month[taskDateObj.getMonth()];
    let taskDescriptionValue = taskDescription.value;
    let taskFullDate = `${taskMonthValue} -- ${taskDateObj.getFullYear()} -- ${taskDateValue} -- ${taskDayValue}`
    console.log(taskFullDate)
    // console.log(taskDescriptionValue)
    let taskObj = {
        id: allTask.length,
        taskName: taskInputValue,
        taskStatus: "Incompleted",
        taskDescription: taskDescriptionValue,
        taskDate: {
            fullDate: `${taskDayValue.slice(0, 3)}, ${taskDateValue} ${month[taskDateObj.getMonth()]}, ${taskDateObj.getFullYear()}`,
            day: taskDayValue,
            date: taskDateValue,
            month: month[taskDateObj.getMonth()],
            year: taskDateObj.getFullYear()
        }
    }


    allTask.push(taskObj);
    saveTasksToLocalStorage();
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    taskDescription.value = "";
    completeBox = document.querySelector(".task-completed-box");
    notificationText.innerText = "Your task has been added successfully..";
    completeBox.classList.add('active');
    setTimeout(function () {
        completeBox.classList.remove('active');
        // notificationText.innerText = "Notification Message";
    }, 1500);
    showTask(allTask);
}

// Function to get tasks from local storage
function getTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        allTask = JSON.parse(storedTasks);
        showTask(allTask);
    }
}

function showTask(array) {
    let display = "";
    array.forEach(function (el, id) {
        display += `<div class="task-box" data-id="${id}">
        <div class="flex">
            <div class="action-box">
                <input type="checkbox" class="checkbox" onclick="checkRemove(${id})"
                    data-id="${id}">
            </div>
            <div class="task-box-info">
                <h3>${el.taskName}</h3>
                <p>${el.taskDate.fullDate}</p>
            <p class="task-status ${(el.taskStatus == "Completed") ? 'completed' : 'pending'
            }"><i class="fa-solid ${(el.taskStatus == "Completed") ? 'fa-circle-check' : 'fa-hourglass-half'}"></i>${(el.taskStatus == "Completed") ? "Done" : "Pending"}</p>
            </div>
            <div class="action-box-end">
                <div class="complete-delete">
                    <button class="task-completed-btn ${(el.taskStatus == "Completed") ? 'd-none' : ''
                }" onclick="completedTask(${el.id})">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="task-delete-btn" onclick="removeTask(id)">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <button class="get-details" onclick="fetchDetails(${el.id})">
                    <i class="fa-solid fa-pencil"></i><span class="txt">Edit</span>
                </button>
            </div>
        </div>
    </div>`;
    });
    displayLoader();
    document.querySelector(".task-grid").innerHTML = display;

    if (array.length == 0) {
        document.querySelector(".task-grid").innerHTML = `<h2>Add task to get started</h2>`;
    }

    // let taskStatusElement = document.querySelector(".task-status");
    // if (taskStatusElement.innerText == "Done") {
    //     taskStatusElement.style.color = "#0174BE";
    // }

}


function removeTask(id) {
    allTask.splice(id, 1);
    saveTasksToLocalStorage();
    showTask(allTask);
    completeBox = document.querySelector(".task-completed-box");
    notificationText.innerText = "Your task has been removed successfully..";
    completeBox.classList.add('active');
    setTimeout(function () {
        completeBox.classList.remove('active');
        // notificationText.innerText = "Notification Message";
    }, 1500);
}


function filterCompleted() {
    let completed = allTask.filter(function (el) {
        return el.taskStatus == "Completed";
    });
    displayLoader();
    showTask(completed);
}


function filterIncompleted() {
    let incompleted = allTask.filter(function (el) {
        return el.taskStatus == 'Incompleted';
    });
    displayLoader();
    showTask(incompleted);
}


function completedTask(id) {
    console.log(allTask[id].taskStatus)
    allTask[id].taskStatus = "Completed";
    console.log(allTask[id].taskStatus);
    saveTasksToLocalStorage();
    showTask(allTask);
    completeBox = document.querySelector(".task-completed-box");
    notificationText.innerText = "Congratulations, you have successfully completed your task.";
    completeBox.classList.add('active');
    completeBox.classList.add('alert');
    setTimeout(function () {
        completeBox.classList.remove('active');
        // notificationText.innerText = "Notification Message";
    }, 1500);
    completeBox.classList.remove('alert');
}


function displayLoader() {
    var myElement = document.querySelector(".loader-wrap");
    myElement.classList.add('active');
    setTimeout(function () {
        myElement.classList.remove('active');
    }, 300);
}


function deleteAll() {
    if (allTask.length !== 0) {
        if (confirm("Are you sure you want to delete all task ?") == true) {
            checkBoxes = document.querySelectorAll('.checkbox');
            checkBoxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            allTask.splice(0, allTask.length);
            document.querySelector('.operation-box').classList.remove("active");
            setTimeout(function () {
                saveTasksToLocalStorage();
                showTask(allTask);
            }, 500);
        }
    }
    else if (selectArray.length === 0) {
        alert("Please add task.");
        return;
    }
}


function toggleDeleteButton(btn) {
    // alert()
    if (btn.style.display === "none") {
        btn.style.display = "inline-block";
    } else {
        btn.style.display = "none";
    }
}



document.querySelector(".add-task-btn").addEventListener("click", function () {
    document.querySelector('.form-popup').classList.add("active");
    document.querySelector('.overlay').classList.add("active");
})


document.querySelector(".overlay").addEventListener("click", function () {
    document.querySelector('.form-popup').classList.remove("active");
    document.querySelector('.task-expand').classList.remove("active");
    this.classList.remove("active");
})


document.querySelector(".task-expand .back-btn").addEventListener("click", function () {
    document.querySelector('.task-expand').classList.remove("active");
    document.querySelector('.overlay').classList.remove("active");
})


document.querySelector(".add-top-action .back-btn").addEventListener("click", function () {
    document.querySelector('.form-popup').classList.remove("active");
    document.querySelector('.overlay').classList.remove("active");
})

// document.querySelectorAll(".get-details").forEach(el => {
//     el.addEventListener("click", function () {
//         let dataValue = this.closest(".task-box").getAttribute('data-id');
//         document.querySelector('.task-expand').classList.add("active");
//         document.querySelector('.overlay').classList.add("active");
//         fetchDetails(dataValue);
//     });
// });

function fetchDetails(id) {
    document.querySelector('#task-name').innerText = allTask[id].taskName;
    document.querySelector('#task-day').innerText = allTask[id].taskDate.day;
    document.querySelector('#task-description').value = allTask[id].taskDescription;
    document.querySelector('#task-date').innerText = `${(allTask[id].taskDate.month).slice(0, 3)} ${allTask[id].taskDate.date}, ${allTask[id].taskDate.year}`;
    document.querySelector('.task-expand').classList.add("active");
    document.querySelector('.overlay').classList.add("active");
    taskEditForm.addEventListener("submit", function (e) {
        e.preventDefault();
        allTask[id].taskDescription = document.querySelector('#task-description').value;
        localStorage.setItem('tasks', JSON.stringify(allTask));
        document.querySelector('.task-expand').classList.remove("active");
        document.querySelector('.overlay').classList.remove("active");
        completeBox = document.querySelector(".task-completed-box");
        notificationText.innerText = "Your task has been updated successfully..";
        completeBox.classList.add('active');
        setTimeout(function () {
            completeBox.classList.remove('active');
            // notificationText.innerText = "Notification Message";
        }, 1500);
        // console.log(allTask);
    });
}

let buttons = document.querySelectorAll('.all-btns .btn');
buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        buttons.forEach(function (btn) {
            btn.classList.remove('active');
        });

        this.classList.add('active');
    });
});

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    document.querySelector('.form-popup').classList.remove("active");
    document.querySelector('.overlay').classList.remove("active");
    addTask();
})

document.querySelector("#completedTaskButton").addEventListener("click", () => {
    filterCompleted('complete');
})

document.querySelector("#incompletedTaskButton").addEventListener("click", () => {
    filterIncompleted('incomplete');
})

document.querySelector("#allTaskButton").addEventListener("click", () => {
    showTask(allTask);
});

document.querySelector("#deletedTaskButton").addEventListener("click", () => {
    alert("Currently this feature is on Development stage.")
});



let selectArray = [];
// document.querySelectorAll(".checkbox").forEach(function(el){
//     el.addEventListener("click",function(){
//         id = el.closest(".task-box").getAttribute('data-id');
//         alert(id)
//     })
// })

function checkRemove(id) {
    var checkbox = document.querySelector(`.checkbox[data-id="${id}"]`);
    if (checkbox.checked == true) {
        if (!selectArray.includes(id)) {
            selectArray.push(id);
        }
    }
    else if (checkbox.checked == false) {
        const index = selectArray.indexOf(id);
        // console.log(id);
        if (index !== -1) {
            selectArray.splice(index, 1);
        }
    }
    console.log(selectArray)
    if (selectArray.length == 0) {
        document.querySelector(".operation-box").classList.remove('active');
    }
    else {
        document.querySelector(".operation-box").classList.add('active');
    }
}

function deleteButton() {
    if (selectArray.length === 0) {
        alert("Please select a task to delete.");
        return;
    }

    // if (confirm("Are you sure you want to remove this task?")) {
    if (confirm("Are you sure you want to remove this task?")) {
        // Sort the array in descending order to avoid index issues
        selectArray.sort((a, b) => b - a);

        for (const index of selectArray) {
            if (index >= 0 && index < allTask.length) {
                const deletedTask = allTask.splice(index, 1)[0];
                trashItems.push[deletedTask];
                console.log(trashItems)
            }
        }
        saveTasksToLocalStorage();
        showTask(allTask);
        // console.log(allTask);
    } else {
        alert("Removal canceled.");
    }
    selectArray = [];
    document.querySelector('.operation-box').classList.remove("active");
}

// flatpickr("#taskDate", {
//     minDate: "today",
//     dateFormat: "d.m.Y",
//     maxDate: "15.12.2024"
// });

// flatpickr("#taskTime", {
//     enableTime: true,
//     noCalendar: true,
//     dateFormat: "H:i",
//     time_24hr: false
// });

// showTask(allTask);
getTasksFromLocalStorage();

// allTask = localStorage.getItem('tasks');
// allTask=JSON.parse(allTask)
// console.log(allTask,typeof allTask)

// window.onload = function() {
//     // Add your code here to run when the window is fully loaded
//     document.querySelector('.outer-loader-wrap').classList.add('active');
// };
  