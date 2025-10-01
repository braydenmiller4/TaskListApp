//Attempt to retrieve task entries from local storage
const localEntries = localStorage.getItem('taskEntries');

//Initialize array to store tasks
const taskList = {
    tasks: [],
}

//If there were any tasks in local storage, load the list and render it to screen
if(localEntries){
    loadList();
    renderList();
}

//Get button from HTML that will show the task entry form
const showFormButton = document.getElementById("showFormButton");

//Add event listener to make form appear when button is pressed
showFormButton.addEventListener("click", function(event){
    const addTaskForm = document.getElementById("addTaskForm");
    addTaskForm.style.display = "block";
    showFormButton.style.display = "none";
})

//Add event listener for button to close form
const closeFormButton = document.getElementById("closeTaskForm");

closeFormButton.addEventListener("click", function(event){
    const addTaskForm = document.getElementById("addTaskForm");
    addTaskForm.style.display = "none";
    showFormButton.style.display = "block";
})


//Get the task form element from HTML file
const taskForm = document.getElementById("addTaskForm");

//Make event listener for when a task is submitted
taskForm.addEventListener("submit", function(event){
    event.preventDefault(); //Prevents going to new URL when submit button is pressed
    const formData = new FormData(event.target);
    const taskTitle = formData.get("title");
    //taskTitle.classList.add('taskTitle');
    const taskDescription = formData.get("description");
    //taskDescription.classList.add('taskDescription');
    const taskDate = formData.get("date");
    const newTask = {
        title: taskTitle,
        description: taskDescription,
        date: taskDate,
    }

    showFormButton.style.display = "block";

    if(event.target.classList.contains("editing")){
        const entryIndex = event.target.dataset.entry;
        taskList.tasks[entryIndex] = newTask;

        const formEditButton = event.target.querySelector('[type=submit]');

        event.target.classList.remove("editing");
        event.target.dataset.entry = null;
        formEditButton.classList.remove('button-edit');
        formEditButton.value = 'Submit';
    }else {
        taskList.tasks.push(newTask);
    }

    event.target.reset();
    sortList();
    saveList();
    renderList();
    document.getElementById("addTaskForm").style.display = "none";
})


//Function to save to local storage
function saveList() {
    localStorage.setItem('taskEntries', JSON.stringify(taskList.tasks));
}

//Function to load local storage
function loadList() {
    const localEntries = JSON.parse(localStorage.getItem('taskEntries'));
    localEntries.forEach((entry)=> {
        taskList.tasks.push(entry);
    });
}

//Function to sort list
function sortList() {
    taskList.tasks.sort(function(a,b) {
        const dateA = Date.parse(a.date);
        const dateB = Date.parse(b.date);

        return dateA-dateB;
    })
}

function renderList() {
    const taskListDisplay = document.getElementById('addTaskList');
    taskListDisplay.innerHTML = "";
    taskList.tasks.forEach(
        function(taskItem, index) {
            //Create a new list item element
            const newTaskItem = document.createElement('li');

            //Create a new details element
            const newDetailsElement = document.createElement('details');

            //Create a new summary element
            const newSummaryElement = document.createElement('summary');

            //Create a new delete button
            const newDeleteButton = document.createElement('button');
            newDeleteButton.classList.add('button');
            newDeleteButton.textContent = "Delete";
            newDeleteButton.id = "delete";

            //Create a new checkbox input
            const newCheckboxInput = document.createElement('input');
            newCheckboxInput.type = "checkbox";
            newCheckboxInput.value = "Complete Task";
            newCheckboxInput.classList.add("checkbox");

            //Make new edit button     
            const newTaskItemEdit = document.createElement('button');
            newTaskItemEdit.innerText = "Edit";
            newTaskItemEdit.classList.add("button");
            newTaskItemEdit.id = 'addTaskSubmit';

            //Add event listener for edit button
            newTaskItemEdit.addEventListener("click", function(event){
                showFormButton.style.display = "none";
                newTaskItemEdit.textContent = "Cancel";
                const entryForm = document.getElementById("addTaskForm");
                entryForm.style.display = "block";
                const entryTitle = document.getElementById("addTaskTitle");
                const entryDescription = document.getElementById("addTaskDescription");
                const entryDate = document.getElementById("addTaskDate");
                const entryFormSubmit = taskForm.querySelector('[type=submit]');

                entryForm.classList.add("editing");

                entryForm.dataset.entry = index;

                entryTitle.value = taskList.tasks[index].title;
                entryDescription.value = taskList.tasks[index].description;
                entryDate.value = taskList.tasks[index].date;

                entryTitle.focus();

                entryFormSubmit.value = 'Update';
                entryFormSubmit.classList.add('button-edit');
                
                saveList();
                renderList();

            })


            //Set the inner HTML of the summary element to the task title
            newSummaryElement.append(taskItem.title);
            newSummaryElement.append(newCheckboxInput);
            newSummaryElement.append(newTaskItemEdit);
            newSummaryElement.append(newDeleteButton);
            

            //Add click event listener to delete button
            newDeleteButton.addEventListener("click", function(event){
                taskList.tasks.splice(index, 1);

                saveList();
                renderList();
            })

            //Add click event listener to completed checkbox (essentially the same functionality as the delete button)
            newCheckboxInput.addEventListener("click", function(event){
                taskList.tasks.splice(index, 1);

                saveList();
                renderList();
            })

            
            //Append summary to details
            newDetailsElement.append(newSummaryElement);
            
            //Make new paragraph for description with label
            const newDescriptionElement = document.createElement('p');
            newDescriptionElement.textContent = "Description: ";
            //Append description to paragraph and details
            newDescriptionElement.append(taskItem.description);
            newDetailsElement.append(newDescriptionElement);

            //Make new paragraph for date with label
            const newDateElement = document.createElement('p');
            newDateElement.textContent = "Date: ";
            //Append date to paragraph and details
            newDateElement.append(taskItem.date);
            newDetailsElement.append(newDateElement);

            //Append details to the list item
            newTaskItem.append(newDetailsElement);
            //Append list item to the list
            taskListDisplay.appendChild(newTaskItem);
            
            

        }
    )
}