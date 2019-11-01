const {app, BrowserWindow, Menu} = require('electron')
const shell = require('electron').shell
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800, 
    height: 600,     
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

  let menuTemplate = [
      {
          label: 'Menu',
          submenu: [
              {label:'Adjust Notification Value'},
              {
                label:'CoinMarketCap',
                click() { 
                    shell.openExternal('http://coinmarketcap.com')
                },
                accelerator: 'CmdOrCtrl+Shift+C'
            },
            {type:'separator'},  // Add this
            {
                label:'Exit', 
                click() { 
                    app.quit() 
                } 
            }
          ]
      },
      {
        label: 'Info'
      }
  ];

  if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
      label: 'Developer Tools',
      submenu:[
        {
          role: 'reload'
        },
        {
          label: 'Toggle DevTools',
          accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        }
      ]
    });
  }

  let menu = Menu.buildFromTemplate(menuTemplate)

  Menu.setApplicationMenu(menu); 
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipc.on('update-notify-value', function (event, arg) {
  win.webContents.send('targetPriceVal', arg)
})