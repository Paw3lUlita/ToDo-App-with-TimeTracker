const apikey = 'c984412a-88bf-452d-b08a-793df67c859e';
const apihost = 'https://todo-api.coderslab.pl';







function apiListTasks() {
    return fetch(
      apihost + '/api/tasks',
      {
        headers: { Authorization: apikey }
      }
    ).then(
      function(resp) {
        if(!resp.ok) {
          alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
      }
    )
  }


  function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);
  
    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);
  
    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);
  
    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);
  
    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);
    
  
    if(status == 'open') {
      const finishButton = document.createElement('button');
      finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
      finishButton.innerText = 'Finish';
      headerRightDiv.appendChild(finishButton);
    }
  
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    section.appendChild(ul);

    
    apiListOperationsForTask(taskId).then(
        function(response) {
            
          response.data.forEach(
              
            function(operation) { renderOperation(ul, operation.id, status, operation.description, operation.timeSpent); }
          );
        }
      )


    const formDiv = document.createElement("div");
    formDiv.className = 'card-body';
    section.appendChild(formDiv);

    const descForm = document.createElement('form');
    formDiv.appendChild(descForm);

    formInnerDiv = document.createElement('div');
    formInnerDiv.className = 'input-group';

    descForm.appendChild(formInnerDiv);

    const operationInput = document.createElement('input');

    operationInput.type = 'text';
    operationInput.placeholder = 'Operation description';
    operationInput.className = 'form-control';
    operationInput.minLength = '5';

    formInnerDiv.appendChild(operationInput);

    btnDiv = document.createElement('div');
    btnDiv.className = 'input-group-append';

    formInnerDiv.appendChild(btnDiv);

    operationAddButton = document.createElement('button');

    operationAddButton.className = 'btn btn-info';
    operationAddButton.innerText = 'Add';

    btnDiv.appendChild(operationAddButton);
  

  }


  function renderOperation(operationsList, operationId,  status, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
  
    // operationsList to lista <ul>
    operationsList.appendChild(li);
  
    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);
  
    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = timeSpent + 'm';
    descriptionDiv.appendChild(time);

    const liBtnDiv = document.createElement('div');
    li.appendChild(liBtnDiv);

    
  
    if(status == 'open') {
      const btn15min = document.createElement('button');
      btn15min.className = 'btn btn-outline-success btn-sm mr-2';
      btn15min.innerText = '+15min';
      liBtnDiv.appendChild(btn15min);

      const btn1h = document.createElement('button');
      btn1h.className = 'btn btn-outline-success btn-sm mr-2';
      btn1h.innerText = '+1h';
      liBtnDiv.appendChild(btn1h);

      const deleteOperationButton = document.createElement('button');
    deleteOperationButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteOperationButton.innerText = 'Delete';
    liBtnDiv.appendChild(deleteOperationButton);


    }
    // ...
  }
  


  function apiListOperationsForTask(taskId) {
    return fetch( `${apihost}/api/tasks/${taskId}/operations`,

    {
        headers: { Authorization: apikey }
    }
       
    ).then(
      function(resp) {
        if(!resp.ok) {
          alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
      }
    );
  }
  
  
  
  function apiCreateTask(title, description) {
    return fetch(
      apihost + '/api/tasks',
      {
        headers: { Authorization: apikey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, description: description, status: 'open' }),
        method: 'POST'
      }
    ).then(
      function(resp) {
        if(!resp.ok) {
          alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
      }
    )
  }
  
  function timeFormatter (minutes){

    return `${(minutes/60).toFixed(0)} h ${minutes%60} min`

  }

 

  document.addEventListener('DOMContentLoaded', function() {


    apiListTasks().then(function(response) {

        for (let task of response.data){
            renderTask(task.id, task.title, task.description, task.status);
        }

    })


    const addTaskForm = document.querySelector(".js-task-adding-form");
    addTaskForm.addEventListener('submit', e => {
    
        e.preventDefault();
        const inputs = addTaskForm.querySelectorAll('input');
    
        apiCreateTask(inputs[0].value, inputs[1].value);
    
        
    
        apiListTasks().then(function(response) {
    
            const tasks = response.data;
            renderTask(tasks[tasks.length-1].id, tasks[tasks.length-1].title, tasks[tasks.length-1].description, tasks[tasks.length-1].status);
                
            
    
        })
    
        
    
    })
    

   
    
  
});


