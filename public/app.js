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

    if(event.target.classList.contains("editing")){
        const entryIndex = event.target.dataset.entry;
        taskList.tasks[entryIndex] = newTask;

        const formEditButton = event.target.querySelector('[type=submit]');

        event.target.classList.remove("editing");
        event.target.dataset.entry = null;
        formEditButton.classList.remove('button-edit');
        formEditButton.value = 'Add';
    }else {
        taskList.tasks.push(newTask);
    }

    event.target.reset();
    saveList();
    renderList();
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
            newDeleteButton.textContent = "Delete";
            newDeleteButton.id = "delete";

            //Create a cancel button
            const newCancelButton = document.createElement('button');

            //Create a new checkbox input
            const newCheckboxInput = document.createElement('input');
            newCheckboxInput.type = "checkbox";

            //Make new edit button
            const newTaskItemEdit = document.createElement('button');
            newTaskItemEdit.innerText = "Edit";
            newTaskItemEdit.classList.add("button");
            newTaskItemEdit.classList.add("button-edit");

            //Add event listener for edit button
            newTaskItemEdit.addEventListener("click", function(event){
                const entryForm = document.getElementById("addTaskForm");
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

                const entryEditButton = document.getElementById("newTaskItemEdit");
                entryEditButton.value = 'Cancel';
                

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