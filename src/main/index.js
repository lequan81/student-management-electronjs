import { BrowserWindow, app, ipcMain, nativeTheme, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import creds from './cred.json'
const WindowStateManager = require('electron-window-state-manager')
const Store = require('electron-store')
const { GoogleSpreadsheet } = require('google-spreadsheet')
let doc, mainWindow, splash

const mainWindowState = new WindowStateManager('mainWindow', {
  defaultWidth: 600,
  defaultHeight: 520
})

const storeConfig = {
  name: 'data',
  fileExtension: 'json',
  // cwd: join(__dirname, '../renderer/src/db/')
  encryptionKey: app.isPackaged ? 'thisismysecretkey' : undefined
}
const store = new Store(storeConfig)
// console.log(store.path)
initStore()
getSheetId()

const darkBackgroundColor = '#111827'
const lightBackgroundColor = '#fafafa'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

function createWindow() {
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minHeight: 500,
    minWidth: 600,
    show: false,
    center: true,
    autoHideMenuBar: true,
    backgroundColor: nativeTheme.shouldUseDarkColors ? darkBackgroundColor : lightBackgroundColor,
    icon: join(__dirname, '../../resources/icon.png'),
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      devTools: app.isPackaged ? false : true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      enableRemoteModule: false,
      contextIsolation: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false
    }
  })

  splash = new BrowserWindow({
    parent: mainWindow,
    height: 520,
    width: 640,
    transparent: true,
    frame: false,
    center: true,
    show: true,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      devTools: false
    },
    ...(process.platform === 'linux' ? { icon } : {})
  })
  splash.loadURL(join(__dirname, '../renderer/splash.html'))

  if (mainWindowState.maximized) {
    mainWindow.maximize()
  }

  mainWindow.on('close', () => {
    mainWindowState.saveState(mainWindow)
  })

  nativeTheme.on('updated', () => {
    const backgroundColor = nativeTheme.shouldUseDarkColors
      ? darkBackgroundColor
      : lightBackgroundColor
    mainWindow.setBackgroundColor(backgroundColor)
    splash.setBackgroundColor(backgroundColor)
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    setTimeout(() => {
      splash.destroy()
      mainWindow.focus()
    }, 200)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (app.isPackaged) {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  }
}

app.whenReady().then(() => {
  if (process.platform === 'win32') {
    app.setAppUserModelId(app.isPackaged ? 'com.electron' : process.execPath)
  }
  getHomeData()
  getAllClassData()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  autoUpdater.checkForUpdates()
})

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('asynchronous-message', {
    type: 'info',
    message: 'New update available'
  })
  autoUpdater.downloadUpdate()
})

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('asynchronous-message', {
    type: 'info',
    message: 'No update available'
  })
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('asynchronous-message', {
    type: 'success',
    message: 'Update downloaded'
  })
})

autoUpdater.on('error', (info) => {
  mainWindow.webContents.send('asynchronous-message', {
    type: 'error',
    message: info
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function getSheetId() {
  let sheetUrl = store.get('userData.configId')
  let matches = /([\w-_]{15,})/.exec(sheetUrl)
  if (matches) {
    doc = await new GoogleSpreadsheet(matches[0])
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key
    })
  } else {
    throw new Error('Invalid sheets URL')
  }
  return doc
}

async function getAllClassData() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key
  })
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle['className']
  let data = await sheet.getRows()
  let classesData = []
  let studentsList = []
  let available = 0
  data.map(async (rowData) => {
    if (rowData['status'] === 'created' || rowData['status'] === 'create') {
      let dateObject = new Date(
        rowData['startDate'].split('/')[2],
        rowData['startDate'].split('/')[1] - 1,
        rowData['startDate'].split('/')[0]
      ).toLocaleDateString('en-CA')

      let selectSheet = doc.sheetsByTitle[rowData['className']]
      let res = await selectSheet.getRows()
      let date = new Date().toLocaleDateString('vi-VN')
      res.map((student) => {
        if (student['Student Name'] !== '') {
          studentsList.push({
            'Student Name': student['Student Name'],
            Attendance: student[date] === 'FALSE' ? false : student[date] === 'TRUE' && true
          })
          if (student[date] === 'TRUE') {
            available++
          }
        }
      })

      classesData.push({
        className: rowData['className'],
        totalLesson: Number(rowData['totalLesson']),
        members: Number(rowData['members']),
        available: available,
        // eslint-disable-next-line prettier/prettier
        startDate: dateObject,
        students: studentsList
      })
    }
    store.set('classes', classesData)
  })
}

async function takeAttendance(className, classIndex) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key
  })
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle[`${className}`]
  let data = await sheet.getRows({ offset: 1 })
  let date = new Date().toLocaleDateString('vi-VN')
  let studentsData = store.get(`classes.${classIndex}.students`)
  data.map(async (rowData, index) => {
    if (rowData['Student Name'] !== '') {
      rowData[date] = studentsData[index]['Attendance']
      await rowData.save()
    }
  })
}

async function editStudent(action, className, studentName) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key
  })
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle[`${className}`]
  switch (action) {
    case 'remove':
      {
        const data = await sheet.getRows()
        data.map(async (rowData) => {
          if (rowData['Student Name'] === studentName) {
            await rowData.delete()
          }
        })
      }
      break
    case 'add':
      await sheet.addRow({ 'Student Name': studentName }, { insert: true })
      break
  }
}

async function editClass(action, value) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key
  })
  await doc.loadInfo()
  switch (action) {
    case 'add': {
      const sheet = doc.sheetsByTitle['className']
      await sheet.addRow(value)
      break
    }
    case 'remove': {
      const sheet = doc.sheetsByTitle['className']
      const data = await sheet.getRows()
      data.map(async (rowData) => {
        if (rowData['className'] === value['className']) {
          rowData['status'] = 'remove'
          await rowData.save()
        }
      })
      break
    }
    case 'update': {
      const sheet = doc.sheetsByTitle['className']
      const data = await sheet.getRows()
      let classesData = store.get('classes')
      data.map(async (rowData) => {
        if (rowData['className'] === value['className'] && rowData['status'] !== 'deleted') {
          rowData['className'] = value['newClassName']
          rowData['totalLesson'] = value['totalLesson']
          rowData['members'] = value['members']
          rowData['startDate'] = value['startDate']
          await rowData.save()
        }
      })
      classesData.map((classes, index) => {
        if (classes['className'] === value['className']) {
          store.set(`classes.${index}.className`, value['newClassName'])
          store.set(`classes.${index}.members`, value['members'])
          store.set(`classes.${index}.totalLesson`, value['totalLesson'])
          store.set(`classes.${index}.startDate`, value['startDate'])
        }
      })
      const selSheet = doc.sheetsByTitle[`${value['className']}`]
      let date = new Date(value['startDate'])
      let currentDate = date.getDate()
      let currentDay = date.getDay()
      let lessonDateHeader = ['Student Name']
      for (let i = 0; i < value['totalLesson']; i++) {
        lessonDateHeader.push(date.toLocaleDateString('vi-VN'))
        if (currentDay === 5 || currentDay === 6) {
          //Friday + 2 day = Sunday, as well as Saturday
          date.setDate(currentDate + 1) //+1 for Sunday, so after change the day will be Monday
          currentDay = date.getDay()
          currentDate = date.getDate()
        }
        date.setDate(currentDate + 2)
        currentDay = date.getDay()
        currentDate = date.getDate()
      }
      // await selSheet.getRows()
      await selSheet.loadHeaderRow()
      await selSheet.setHeaderRow(lessonDateHeader)
      await selSheet.updateProperties({ title: value['newClassName'] })
      break
    }
  }
}

async function sheetCreate(value) {
  const sheet = doc.sheetsByTitle['userData']
  await sheet.addRow(value)
}

async function initStore() {
  if (store.get('firstInit') === undefined) {
    store.set({
      homeData: [],
      firstInit: false,
      isReachLimit: false,
      userData: {
        configId:
          'https://docs.google.com/spreadsheets/d/1hYKa908x9KskkvX7ZQVOqiHqVgip9aCdYRmI5aiUT7w/edit?pli=1#gid=1145835223'
      },
      classes: []
    })
  }
}

async function getHomeData() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key
  })
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle['homeData']
  let data = await sheet.getRows()
  let homeData = []
  data.map(async (rowData) => {
    homeData.push({
      title: rowData['title'],
      value: rowData['value']
    })
  })
  store.set('homeData', homeData)
}

// IPC listener
ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = await store.get(val)
})
ipcMain.on('electron-store-set', async (event, key, val) => {
  await store.set(key, val)
})
ipcMain.on('electron-store-delete', async (event, val) => {
  event.returnValue = await store.delete(val)
})
ipcMain.on('electron-takeAttendance', async (event, key, index) => {
  await takeAttendance(key, index)
})
ipcMain.on('electron-editStudent', async (event, action, key, value) => {
  await editStudent(action, key, value)
})
ipcMain.on('electron-editClass', async (event, action, value) => {
  await editClass(action, value)
})
ipcMain.on('electron-sheetCreate', async (event, value) => {
  await sheetCreate(value)
})
