import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  updateMessage: function () {
    ipcRenderer.on('asynchronous-message', function (event, message) {
      return message
    })
  },
  store: {
    get(key) {
      return ipcRenderer.sendSync('electron-store-get', key)
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val)
    },
    delete(key) {
      return ipcRenderer.sendSync('electron-store-delete', key)
    }
  },
  sheets: {
    takeAttendance(key, index) {
      ipcRenderer.send('electron-takeAttendance', key, index)
    },
    editStudent(action, key, val) {
      ipcRenderer.send('electron-editStudent', action, key, val)
    },
    editClass(action, val) {
      ipcRenderer.send('electron-editClass', action, val)
    },
    create(val) {
      ipcRenderer.send('electron-sheetCreate', val)
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
}
