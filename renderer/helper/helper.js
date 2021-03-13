
const { ipcMain , ipcRenderer } = require('electron')
const path = require('path')
const axios = require('axios')
const { INIT_MAP } = require("./resourceConfig")


function registerAddResourceWindowHandler(key, mainWindow, Window){
     // create add notificaiton window
   const {fileName , resourceName, addResourceWindowEventName }= INIT_MAP[key];
   let addTodoWin ;
  ipcMain.on(addResourceWindowEventName, () => {
    // if addTodoWin does not already exist
    if (!addTodoWin) {
      // create a new add todo window
      addTodoWin = new Window({
        file: path.join('renderer', fileName),
        width: 900,
        height: 900,
        // close with the main window
        parent: mainWindow
      })

      // cleanup
      addTodoWin.on('closed', () => {
        addTodoWin = null
      })
    }
  })
}


function registerViewResourceWindow(key){
    // create add notification window button
     const {createResourceViewBtn, addResourceWindowEventName }= INIT_MAP[key];
    document.getElementById(createResourceViewBtn).addEventListener('click', () => {
        ipcRenderer.send(addResourceWindowEventName )
    })
}

const config = {
	timeout: 10000,
	headers: {
		'Access-Control-Allow-Origin': '*'
	}
};
const axiosRef =  axios.create(config);
 async function initData(resourceName) {
  let response;
   console.log("::::::::iniTData::::::", resourceName);
  try {
      const params = {
        method: "post",
        url: "http://localhost:9000/"+resourceName+"/fn_fillAll",
        retryDelay: 1000
      };
    
        response = await axiosRef.request(params);
        console.error("::::::::done::::::");
      } catch (e) {
        console.error("::::::::error::::::", e);
      }
      return response ?   response.data: response;
  }
function registerInitEvent(key){
  const {formId, eventName} = INIT_MAP[key];
    document.getElementById(formId).addEventListener('submit', (evt) => {
      // prevent default refresh functionality of forms
      evt.preventDefault()
      alert("do it----------------- -------------"+ eventName)
      // send todo to main process
      ipcRenderer.send(eventName, "input.value")
  })
}

function registerEventHandler(key){
      // create add notificaiton window
    console.log("::::register:::::::", key)
    const {eventName, resourceName }= INIT_MAP[key];
    ipcMain.on(eventName, (event, todo) => {
   console.log("on....................")
    console.log("#####################init all")
   // const updatedTodos = todosData.addTodo(todo).todos;
    initData(resourceName)
    //mainWindow.send('todos', updatedTodos)
  })

}

function registerAddResourceWindowHandlers(mainWindow,Window){
  Object.keys(INIT_MAP).forEach(key=> registerAddResourceWindowHandler(key, mainWindow,Window));
}
function registerEventHandlers(mainWindow,Window){
  Object.keys(INIT_MAP).forEach(key=> registerEventHandler(key));
}
function registerViewResourceWindows(mainWindow,Window){
  Object.keys(INIT_MAP).forEach(key=> registerViewResourceWindow(key));
}
const helpers  = {
    registerInitEvent,
    registerViewResourceWindows,
    registerAddResourceWindowHandlers,
    registerEventHandlers
}
module.exports = helpers;