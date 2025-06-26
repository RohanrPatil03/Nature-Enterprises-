const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "Nature Enterprises",
    icon: path.join(__dirname, 'public/favicon.ico')
  });

  // Load the index.html of the app.
  // In development, load from the Next.js dev server.
  // In production, load the exported static file.
  const startUrl = isDev
    ? 'http://localhost:9002'
    : `file://${path.join(__dirname, 'out/index.html')}`;
  
  win.loadURL(startUrl);

  // Open the DevTools in development.
  if (isDev) {
    win.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Listen for the 'save-pdf' message from the renderer process
ipcMain.on('save-pdf', async (event) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;

  const { filePath } = await dialog.showSaveDialog(win, {
    title: 'Save Proposal PDF',
    defaultPath: `Proposal-${new Date().toISOString().slice(0, 10)}.pdf`,
    filters: [{ name: 'PDF Documents', extensions: ['pdf'] }]
  });

  if (filePath) {
    try {
      const pdfData = await win.webContents.printToPDF({
          marginsType: 0, // No margins
          printBackground: true,
          pageSize: 'A4',
      });
      fs.writeFile(filePath, pdfData, (error) => {
        if (error) {
            console.error('Failed to write PDF to file', error);
            dialog.showErrorBox('Save PDF Error', 'Could not save the PDF to the specified location.');
        } else {
            console.log('PDF saved successfully');
            // Optionally, show a success message
            dialog.showMessageBox(win, {
                type: 'info',
                title: 'PDF Saved',
                message: 'The proposal has been saved successfully.',
                detail: `File saved to: ${filePath}`
            });
        }
      });
    } catch (error) {
      console.error('Failed to generate PDF', error);
      dialog.showErrorBox('Generate PDF Error', 'An error occurred while generating the PDF.');
    }
  }
});
