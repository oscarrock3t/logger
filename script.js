const dotStatus = document.querySelector('#status');
const form = document.querySelector('#form-sendMsg');
const inputSubmit = document.querySelector('btnSubmit');
const msgs = document.querySelector('#msgs');
const input = document.querySelector('#msgField');
const ws = new WebSocket('ws://' + document.location.host);



function setStatus(status) {
    dotStatus.classList.remove('online');
    dotStatus.classList.remove('offline');
    dotStatus.classList.add(status);
}

function printMessage(value) {
    let p = document.createElement('p');
    p.classList.add('msgBox');
    p.innerHTML = value;
    msgs.appendChild(p);
}

form.addEventListener('submit', e => {
    e.preventDefault();
    ws.send(input.value);
    input.value = '';
});

ws.onopen = () => setStatus('online');

ws.onerror = () => setStatus('offline');

ws.onclose = () => setStatus('offline');

ws.onmessage = (response) => {
    console.log(response.data);
    printMessage(response.data.toString());
}