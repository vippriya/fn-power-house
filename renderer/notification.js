

const { ipcRenderer } = require('electron')
const axios = require('axios');


function fetchData(){
    
}


async function populateData() {
    let payload = { name: 'John Doe', occupation: 'gardener' };
     alert("post2")

    let res = await axios.post('http://httpbin.org/post', payload);

    let data = res.data;
    console.log(data);
    alert("post")
}




document.getElementById('notificationForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()
  alert("submited")
  // input on the form
  const input = evt.target[0]


  // send todo to main process
  ipcRenderer.send('add-todo', input.value)

  // reset input
  input.value = ''
})

document.getElementById('notificationInitForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()
  alert("do it------------------------------")
  // input on the form
  //const input = evt.target[0]


  // send todo to main process
  ipcRenderer.send('init-all-notifications', "input.value")

  // reset input
  input.value = ''
})