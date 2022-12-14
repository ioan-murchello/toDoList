(function(){
  let tasks = [];

  if(tasks.length){
    putLiItemInUllists(tasks)
  }

  // flags
  let flag = false;
  let answer = false;

  let ul = document.querySelector('.cards_list');
  let form = document.forms['taskform'];
  let inputtask = form.elements['taskinput'],
      task_btn = form.elements['btn'];

  // all_tasks_completed_tasks_uncompleted_tasks______section
  let completedTasks = document.querySelector('.completed_task'),
      allTasks = document.querySelector('.all_task'),
      uncompleteTask = document.querySelector('.notcomplete_task');

        allTasks.classList.add('active_class');

  completedTasks.addEventListener('click', () => {
    classChanger(completedTasks,allTasks,uncompleteTask);
      showCompleted();
  });

  allTasks.addEventListener('click', () => {
    classChanger(allTasks,completedTasks,uncompleteTask);
    putLiItemInUllists(tasks)
  })

  uncompleteTask.addEventListener('click', () => {
    classChanger(uncompleteTask,allTasks,completedTasks);
    showUncompleted();
  });

  function classChanger(first, second, third){
    first.classList.add('active_class');
    second.classList.remove('active_class');
    third.classList.remove('active_class');
  }
 
  task_btn.addEventListener('click', onFormSubmit);

  function getTime(){
    let am_pm = '12:00';
    let mainTime;
    let date = new Date();
    let times = date.toTimeString().slice(0,5);
    let fullDate = date.toDateString().slice(0,17).split(' ').join(' / ');
    times > am_pm ? mainTime = `${fullDate} / ${times} pm` : mainTime = `${fullDate} / ${times} am`
    return mainTime;  
  }

  function createLiItem(task, index) {
   
    let li = document.createElement('li');

      if(task.completed == true && task.completeTime != null){

        li.classList.add('cards_item','completed');
        li.addEventListener('click', getLiitem);
        li.setAttribute('data-task-id', index)
        li.innerHTML = `

        <div class="text_block">
        <p class="card_text">${task.title}</p>
        <div class="data_wrapper">
          <div class="create_data">Created: <span class="create_time">${task.created}</span></div>
          <div class="create_data">Completed: <span class="complete_time">${task.completeTime}</span></div>
        </div>

        </div>
        <div class="buttons_block">
        <button class="delete_btn">Delete task</button>
        <button class="complete_btn disable_btn_class" disabled>Task complete</button>
        </div>
  `
        return li
      }
        li.classList.add('cards_item');
        li.addEventListener('click', getLiitem);
        li.setAttribute('data-task-id', index)
        li.innerHTML = `
        
          <div class="text_block">
          <p class="card_text">${task.title}</p>
          <div class="data_wrapper">
            <div class="create_data">Created: <span class="create_time">${task.created}</span></div>
            <div class="create_data">Completed: <span class="complete_time"></span></div>
          </div>

          </div>
          <div class="buttons_block">
          <button class="delete_btn">Delete task</button>
          <button class="complete_btn">Task complete</button>
          </div>
    `
    return li;
  }

  function putLiItemInUllists(tasks) {

    ul.innerHTML = '';
     
    if(tasks.length > 0){
        tasks.forEach((item, index) => {
          ul.append(createLiItem(item, index));
        })
    }
  }

  if(localStorage.getItem('taski')){
    tasks = JSON.parse(localStorage.getItem('taski'))
    putLiItemInUllists(tasks)
    }

  function createTaskObject(value){

     let newTask = {
          title: value,
          created: getTime(),
          completeTime: null,
          completed: false
     };

     tasks.push(newTask);
     localStorage.setItem('taski', JSON.stringify(tasks));

     putLiItemInUllists(tasks);  
  }

  function onFormSubmit(event){
    event.preventDefault();

    classChanger(allTasks,completedTasks,uncompleteTask);

    let inputValue = inputtask.value.trim();
    let replaceArrowSymbols = inputValue.replaceAll(/[<]/g, '&#60;');
    if(!replaceArrowSymbols || replaceArrowSymbols == ''){
      alert('Please add a new task')
      return
    }
      let trimmered = replaceArrowSymbols,
        replacered = trimmered.replace(trimmered[0], trimmered[0].toUpperCase());
        createTaskObject(replacered);
        form.reset();
  }

  ul.addEventListener('click', function(event){
      if(event.target == 'li'){
        getLiitem();
      }
  })

  function removeLiitemFromUl(answer, el){
    if(answer == false) return;
    el.remove();
  }
     
  function getLiitem(event){
   let target = event.target;
   let liItem = target.closest('[data-task-id]');
   let id = liItem.getAttribute('data-task-id');
   let completeBtn = liItem.querySelector('.complete_btn');
   let deleteBtn = liItem.querySelector('.delete_btn');
   
      if(checkbox_input.checked == false && target == completeBtn){

          tasks[id].completed = true;
            let time = tasks[id].completeTime = getTime();
            completeBtn.setAttribute('data-disabled', true);
            completeBtn.classList.add('disable_btn_class');
            liItem.querySelector('.complete_time').textContent = time;
            localStorage.setItem('taski', JSON.stringify(tasks));
  
              if(tasks[id].completed == true){
                liItem.classList.add('completed');
                completeBtn.disabled = 'disabled';
                completeBtn.classList.add('disable_btn_class');
                localStorage.setItem('taski', JSON.stringify(tasks));
              }
      }

      if(target == deleteBtn && checkbox_input.checked == false){
        flag = true;
        liItem.style.transform = 'scale(0.95)';
                setTimeout(() => {
                removeLiitemFromUl(flag, liItem);
                deleteFromTasks(tasks, id);
                attributeReplacer(tasks, id);
              }, 500)
      
               localStorage.setItem('taski', JSON.stringify(tasks));
        }

      if(uncompleteTask.classList.contains('active_class') && target == completeBtn && checkbox_input.checked == true){
        // animateChangingClass(liItem,completeBtn)
        question(flag, id, completeBtn, liItem);
      }

      if(uncompleteTask.classList.contains('active_class') && target == completeBtn && checkbox_input.checked == false){
        // animateChangingClass(liItem,completeBtn)
        setTimeout(function(){
          classChanger(uncompleteTask,allTasks,completedTasks);
          showUncompleted();
          localStorage.setItem('taski', JSON.stringify(tasks));

        },500)
        tasks[id].completed = true;
        let time = tasks[id].completeTime = getTime();
        completeBtn.setAttribute('data-disabled', true);
        completeBtn.classList.add('disable_btn_class');
        liItem.querySelector('.complete_time').textContent = time;
        localStorage.setItem('taski', JSON.stringify(tasks));

          if(tasks[id].completed == true){
            liItem.classList.add('completed');
            completeBtn.disabled = 'disabled';
            completeBtn.classList.add('disable_btn_class');
            localStorage.setItem('taski', JSON.stringify(tasks));
          }
             
      }
      
      if(target == deleteBtn && checkbox_input.checked == true){
        deleteQuestion(flag, liItem, id)
        }

      if(target == completeBtn && checkbox_input.checked == true){
        question(flag, id, completeBtn, liItem)
      }
      
  }

function animateChangingClass(item,btn){
    item.classList.add('completed');
    btn.disabled = 'disabled';
    btn.classList.add('disable_btn_class');

        setTimeout(function(){

          item.classList.add('animate_away');
          
            setTimeout(function(){
              classChanger(uncompleteTask,completedTasks,allTasks);
              showUncompleted();
              
              item.classList.remove('animate_away');
              
              localStorage.setItem('taski', JSON.stringify(tasks));
            },300)
            
        }, 500)
        
}

  function deleteFromTasks(arr,id){
     arr.splice(id, 1);
     localStorage.setItem('taski', JSON.stringify(arr))
     return arr
  }
  
  function attributeReplacer(arr, index){

    let arr2 = ul.querySelectorAll('.cards_item');

    for(let i = 0; i <= arr.length; i++){
        for(let j in arr2){
          if(!arr2.length) return;

          if(arr2[j][index] != arr[i]){
              arr2[i][index] = arr[j];
              arr2[i].setAttribute('data-task-id', i);
          }
      }
    }
  }

  function showCompleted(){
   document.querySelectorAll('.cards_item').forEach(item => {
      if(!item.classList.contains('completed')){
        item.classList.add('hide');
        item.classList.remove('show');
      }else{
        item.classList.add('show');
        item.classList.remove('hide');
      }
    })
  
  }

  function showUncompleted(){
    document.querySelectorAll('.cards_item').forEach(item => {
      if(item.classList.contains('completed')){
        item.classList.add('hide');
        item.classList.remove('show');
      }else{
        item.classList.add('show');
        item.classList.remove('hide');
      }
    })
  
  }

  // checkbox
  let point = document.querySelector('.point');
  let pont = point.querySelector('.pont')
  let checkbox_input = document.querySelector('.inp');

  let check = JSON.parse(localStorage.getItem('check'))
      if(check == true){
        checkbox_input.checked = true;
        point.classList.add('switcher_on');
        pont.classList.add('pont_change');
      }
      else{
        point.classList.remove('switcher_on')
        pont.classList.remove('pont_change');
      }

  function saveCheckbox(){
   localStorage.setItem('check', checkbox_input.checked);

   if(checkbox_input.checked == true){
    point.classList.add('switcher_on');
    pont.classList.add('pont_change');
   
    }
    else{
      point.classList.remove('switcher_on')
      pont.classList.remove('pont_change');
    
    }
  }

  checkbox_input.addEventListener('change', saveCheckbox)

  //---------------------------


  function question(fl, id, btn, item, f){
        document.body.style.overflow = 'hidden';

    let popup = document.querySelector('.popup_main_wrapper');
        popup.style.visibility = 'visible';
        popup.style.opacity = 1;
        popup.addEventListener('click', function(event){

          let target = event.target;

          if(target.classList.contains('popup_btn')){
            
              fl = true;
              if(fl){
                tasks[id].completed = true;
                let time = tasks[id].completeTime = getTime();
                btn.setAttribute('data-disabled', true);
                btn.classList.add('disable_btn_class');
                item.querySelector('.complete_time').textContent = time;
                popup.style.visibility = 'hidden';
                popup.style.opacity = 0;
                document.body.style.overflow = '';

                localStorage.setItem('taski', JSON.stringify(tasks));

                  if(tasks[id].completed == true){
                    item.classList.add('completed')
                    btn.disabled = 'disabled';
                    btn.classList.add('disable_btn_class');

                    localStorage.setItem('taski', JSON.stringify(tasks));
                  }
              }
          }

          if(target.classList.contains('popup_btn') && uncompleteTask.classList.contains('active_class') && checkbox_input.checked == true){
            setTimeout(function(){
              classChanger(uncompleteTask,allTasks,completedTasks);
              showUncompleted();
            },500)
            localStorage.setItem('taski', JSON.stringify(tasks));
          }

          if(target.classList.contains('popup_close_btn') || target.classList.contains('popup_main_wrapper')){
            popup.style.visibility = 'hidden';
            popup.style.opacity = 0;
            document.body.style.overflow = ''
          }
        })  
  }

  function deleteQuestion(flag, item, id){
    document.body.style.overflow = 'hidden';

    let popup = document.querySelector('.popup_main_wrapper_delete');
        popup.style.visibility = 'visible';
        popup.style.opacity = 1;

        popup.addEventListener('click', function(event){

      let target = event.target;
     
        if(target.classList.contains('popup_close_btn_delete') || target.classList.contains('popup_main_wrapper_delete')){
          popup.style.visibility = 'hidden';
          popup.style.opacity = 0;
          document.body.style.overflow = ''
        }

        if(target.classList.contains('popup_btn_okay')){
          flag = true;
          if(flag){
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              removeLiitemFromUl(flag, item)
              deleteFromTasks(tasks, id)
              attributeReplacer(tasks, id);
            }, 500)
  
            localStorage.setItem('taski', JSON.stringify(tasks));
          }
          popup.style.visibility = 'hidden';
          popup.style.opacity = 0;
          document.body.style.overflow = ''
        }
    })
  }
})()


 