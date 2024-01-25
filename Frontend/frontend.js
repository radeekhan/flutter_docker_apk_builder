
const socket = new WebSocket("ws://localhost:6060");

var term = new window.Terminal({
    cursorBlink: true
});
term.open(document.getElementById('terminal'));

function init() {
    if (term._initialized) {
        return;
    }

    term._initialized = true;

    term.prompt = () => {
        term.write('\r\n$ ');
    };
    prompt(term);

    term.onData(e => {
        switch (e) {
            case '\u0003': // Ctrl+C
                term.write('^C');
                prompt(term);
                break;
            case '\r': // Enter
                runCommand(term, command);
                command = '';
                break;
            case '\u007F': // Backspace (DEL)
                // Do not delete the prompt
                if (term._core.buffer.x > 2) {
                    term.write('\b \b');
                    if (command.length > 0) {
                        command = command.substr(0, command.length - 1);
                    }
                }
                break;
            case '\u0009':
                console.log('tabbed', output, ["dd", "ls"]);
                break;
            default:
                if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                    command += e;
                    term.write(e);
                }
        }
    });
}

function clearInput(command) {
    var inputLengh = command.length;
    for (var i = 0; i < inputLengh; i++) {
        term.write('\b \b');
    }
}
function prompt(term) {
    command = '';
    term.write('\r\n$ ');
}
socket.onmessage = (event) => {
    term.write(event.data);
}

function runCommand(term, command) {
    if (command.length > 0) {
        clearInput(command);
        socket.send(command + '\n');
        return;
    }
}

init();

//download-button-loading

// const runButton = document.querySelector('#run-button')
// const downloadButtonContent = document.querySelector('#download-button div')
// const downloadButton = document.querySelector('#download-button')
// runButton.addEventListener('click', toggleButton)
//
// function toggleButton() {
//     const urlPath = setInterval(()=>{
//         const path = getURL();
//         if (path==null) {
//
//             downloadButtonContent.classList.add('loading');
//             console.log(path);
//         }
//         else{
//             clearInterval(urlPath);
//             console.log(path);
//             downloadButtonContent.classList.remove('loading');
//             downloadButton.removeAttribute("disabled");
//             downloadButtonContent.classList.add('active');
//             downloadButton.addEventListener('click', function () {
//             window.location.href="http://localhost:3000/static/"+path+"/app-release.apk";
//             })
//         }
//     },250)
// }


// function getURL() { 
//     var myform = document.getElementById("gitbox");
//     var formData = new FormData(myform);
//     var object = {};
//     formData.forEach((value, key) => object[key] = value);
//     var path_url = object.links;
//     var path_array=path_url.split('/'); 
//     var path = path_array[4]
//     // var path = "url";
//     return path;
//     // return "http://localhost:3000/static/"+path+"/app-release.apk";
//     //  fetch("http://localhost:3000/static/"+path+"/app-release.apk")
//   } 

//   function updateCounter() {
//     // const timeCounter = document.getElementById("timeCounter");
//     let seconds = 0;
  
//     const intervalId = setInterval(() => {
//       seconds++;
//     //   timeCounter.textContent = seconds;
//     console.log(seconds);
//     downloadButtonContent.classList.add('loading');
//       // Check if the counter has reached 20 seconds
//       if (seconds >= 20) {
//         clearInterval(intervalId);
//         downloadButtonContent.classList.remove('loading');
//         enableButton();
//       }
//     }, 1000); // Update the counter every second
//   }
  
//   // Function to enable the button
//   function enableButton() {
//     const downloadButton = document.querySelector('#download-button')
//     downloadButton.removeAttribute("disabled");
//     // button.textContent = "Button Active";
//   }
  
//   // Start the time counter