import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { fork,exec } from 'child_process';








async function killProcessUsingPort() {
  

const psList = await import('ps-list');
const processes = await psList.default();


const nodeProcesses = processes.filter(p => ["electron.exe","arshad.exe"].includes(p.name));
if(nodeProcesses.length > 0){
  for(let a of nodeProcesses){
    exec(`taskkill /F /PID ${a.pid}`)
    console.log(a,"pid")
  }
}
app.quit()

}


function createWindow() {
  ipcMain.on('ping', () => console.log('pong'))
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // contextIsolation:false,
      // enableWebSQL:true,
      // nodeIntegrationInSubFrames:true,
      // nodeIntegrationInWorker:true,
      
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  
}

  app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')


  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

let childProcess =  fork(join(__dirname,'../server/app.js'), [])
try{
  if (childProcess && childProcess.stdin) {
    // Send data to the child process
    childProcess.stdin.write(JSON.stringify({ url:app.getPath("userData")  }));
    childProcess.stdin.end(); // Close the stdin stream
  
    // Handle data from the child process
    childProcess.stdout.on('data', (data) => {
      console.log(`Received from child process: ${data}`);
    });
  
    childProcess.stderr.on('data', (data) => {
      console.error(`Error from child process: ${data}`);
    });
  
    childProcess.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  } else {
    console.error('Failed to create child process or access stdin.');
  }
}catch(err){
  console.error('Failed to create child erro',err);
}

  

createWindow()
  

  

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    killProcessUsingPort(8000);
    console.log("app Quiting")    
  }
})
