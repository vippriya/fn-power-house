'use strict'

const axios = require('axios')
const path = require('path')
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')
const productCategoryData = require("./renderer/admin_api/data/productCategory.json")
const product = require("./renderer/admin_api/data/product.json")
const applicationReference= require("./renderer/admin_api/data/applicationReference.json")
const API= require("./API")
const helpers = require("./renderer/helper/helper")


function getUrl(BASE_URL, suffix) {
   
  return BASE_URL + suffix;
}
const GeneralAPI = (BASE_URL, API_TYPE)=> {
    return {
        ["create_" + API_TYPE]:  {
            getConfigParams: (params) => {
           
            return {
                data: params, //JSON.stringify(data),
            };
            },
            getUrl: () => getUrl(BASE_URL, "/create"),
            apiType: API_TYPE,
            method: "post",
        }
    }
}

const BASE_URL = "http://localhost:9000/product";
const API_TYPE = "product";

const ProductAPI = GeneralAPI(BASE_URL, API_TYPE);

const BASE_URL_2 = "http://localhost:9000/product_category";
const API_TYPE_2 = "productCategory";
const ProductCategoryAPI = GeneralAPI(BASE_URL_2, API_TYPE_2);


const BASE_URL_3= "http://localhost:9000/application_reference";
const API_TYPE_3 = "applicationReference";

const ApplicationReferenceAPI = GeneralAPI(BASE_URL_3, API_TYPE_3);

const BASE_URL_4= "http://localhost:9000/notification/fn_fillAll";
const API_TYPE_4 = "notification";

const NotificationAPI = GeneralAPI(BASE_URL_4, API_TYPE_4);


const APIMap = {
    ...ProductAPI,
    ...ApplicationReferenceAPI,
    ...ProductCategoryAPI,
    ...NotificationAPI
}

const config = {
	timeout: 10000,
	headers: {
		'Access-Control-Allow-Origin': '*'
	}
};
const axiosRef =  axios.create(config);

const executeQuery = async (requestProps) => {

    const {action, actionCategory, params, onSuccess, onFailure} = requestProps;

    const requestApiMap = APIMap;
    const {getUrl, method, apiType,getConfigParams, transformResponse} = requestApiMap[action];
    //const url = "http://161.156.175.40:8080/guacamole/api"+ getUrl({platformToken:getPlatformToken()});
    //const url2 = "https://jsonplaceholder.typicode.com/posts"


    const url = getUrl(params);
    const apiHandler = axiosRef;
    const httpMethod = method ? method: "GET";
    let queryConfig =  {url, method};
    if(method === "delete"){
        queryConfig =  {url, method};
    }
    else if(method === "post"){
        queryConfig = getConfigParams ? getConfigParams(params):{}

        queryConfig =  queryConfig.headers ? {
            url,
            method,
            data:queryConfig.data,
            headers:{...config.headers,...queryConfig.headers}
        }:
        {
            url,
            method,
            data:queryConfig.data
        }
    }

    else if(!method){
        queryConfig = {url,   method: 'get'}
    }

       let axiosConfig =transformResponse? {
        ...queryConfig,
        transformResponse:[function(data){

            const responseData = transformResponse(JSON.parse(data));

            return transformResponse(responseData)
        }]
       }:queryConfig;
       let response;
       if(onSuccess){
                 apiHandler.request({
                ...axiosConfig
             }).then(response => onSuccess(response.data))
            .catch(function (error) {
                console.log(error);
                onFailure(error)
            })
        }
        else{
           response =   await apiHandler.request({
            ...axiosConfig,
            retry: 1,
            retryDelay: 1000
         });
       }
       return response ?   response.data: response;

}
   async function fetchData(action, params) {
       
      try {
       
      
        const response = await executeQuery({
          action,
          params,
        });
          console.log("success........", action)
      } catch (e) {
        console.error("::::::::error::::::", e);
      
      }
    }

    


 function makePostRequest() {
     try{
     for (const [key, value] of Object.entries(loadMongoDataAPI)) {
      const action = "create" + "_" + key;
     // console.log(key, value);

      value.forEach((element) => fetchData(action, element));
     
    } 
     }catch(e){
        alert("here")
     }

}

const loadMongoDataAPI = {
    //productCategory: productCategoryData,
    product: product
    //applicationReference:applicationReference
}


require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'renderer', 'node_modules', '.bin', 'electron')
 });

// create a new todo store name "Todos Main"
const todosData = new DataStore({ name: 'Todos Main' })

function main () {
  // todo list window
  let mainWindow = new Window({
    file: path.join('renderer', 'index.html')
  })

  // add todo window
  let addTodoWin

  // TODO: put these events into their own file

  // initialize with todos
  mainWindow.once('show', () => {
    mainWindow.webContents.send('todos', todosData.todos)
  })

  // create add todo window
  ipcMain.on('add-todo-window', () => {
    // if addTodoWin does not already exist
    if (!addTodoWin) {
      // create a new add todo window
      addTodoWin = new Window({
        file: path.join('renderer', 'add.html'),
        width: 400,
        height: 400,
        // close with the main window
        parent: mainWindow
      })

      // cleanup
      addTodoWin.on('closed', () => {
        addTodoWin = null
      })
    }
  })

 helpers.registerAddResourceWindowHandler("notification", mainWindow,Window)

 helpers.registerAddResourceWindowHandler("product", mainWindow,Window)

  

  // add-todo from add todo window
  ipcMain.on('add-todo', (event, todo) => {
    const updatedTodos = todosData.addTodo(todo).todos

    makePostRequest()

    mainWindow.send('todos', updatedTodos)
  })

  ipcMain.on('add-notification', (event, todo) => {
    //const updatedTodos = todosData.addTodo(todo).todos

    addNotification(todo)

    mainWindow.send('todos', updatedTodos)
  })

  helpers.registerEventHandler("notification")
   helpers.registerEventHandler("product")
  // delete-todo from todo list window
  ipcMain.on('delete-todo', (event, todo) => {
    const updatedTodos = todosData.deleteTodo(todo).todos

    mainWindow.send('todos', updatedTodos)
  })
}

app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})