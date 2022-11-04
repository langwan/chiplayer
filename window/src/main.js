const { app, BrowserWindow, Menu } = require("electron");
const openAboutWindow = require("about-window").default;
const freeport = require("freeport");
const fetch = require("electron-fetch").default;

const { execFile } = require("child_process");

let backendPort = 8000;
let win = null;
app.commandLine.appendSwitch("disable-web-security");
app.whenReady().then(() => {
  freeport(function (err, port) {
    backendPort = port;

    let backendBin = "./chiplayer_backend";
    if (process.platform == "darwin") {
      backendBin = "./chiplayer_backend";
    } else {
      backendBin = "./chiplayer_backend.exe";
    }

    try {
      const child = execFile(backendBin, ["--port", port], {
        cwd: __dirname + "/bin",
        env: { langgo_env: "production", PATH: process.env.PATH },
      });
      let url = "http://127.0.0.1:" + port + "/app";

      child.stdout.on("data", (data) => {
        if (win != null) {
          return;
        }
        console.log("url", url);
        win = new BrowserWindow({
          title: "chiplayer",
          maximizable: true,
          resizable: true,
          webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,

            webSecurity: false,
          },
        });
        setTimeout(() => {
          win.loadURL(url, {
            userAgent: "App",
          });
          if (process.env.NODE_ENV == "development")
            win.webContents.openDevTools();
        }, 1000);
      });

      const appMenu = {
        label: "chiplayer",
        role: "appMenu",
        submenu: [
          {
            label: "关于 chiplayer",
            click() {
              openAboutWindow({
                icon_path: __dirname + "/bin/frontend/icon.png",
                product_name: "chiplayer",
                bug_report_url: "https://github.com/langwan/chimp3/issues",
                copyright: "2022 痴货发明家(langwan)",
                homepage: "https://space.bilibili.com/401571418",
                description: "订制开发请找作者 B站 痴货发明家",
                license: "MIT",
                use_version_info: true,
              });
            },
          },
          {
            label: "风格 单击示波器可以切换风格",
            click() {
              openAboutWindow({
                icon_path: __dirname + "/bin/frontend/icon.png",
                product_name: "CHIMP3",
                bug_report_url: "https://github.com/langwan/chimp3/issues",
                copyright: "2022 痴货发明家(langwan)",
                homepage: "https://space.bilibili.com/401571418",
                description: "订制开发请找作者 B站 痴货发明家",
                license: "MIT",
                use_version_info: true,
              });
            },
          },
          {
            label: "播放 支持单曲暂停、多曲连放",
            click() {
              openAboutWindow({
                icon_path: __dirname + "/bin/frontend/icon.png",
                product_name: "CHIMP3",
                bug_report_url: "https://github.com/langwan/chimp3/issues",
                copyright: "2022 痴货发明家(langwan)",
                homepage: "https://space.bilibili.com/401571418",
                description: "订制开发请找作者 B站 痴货发明家",
                license: "MIT",
                use_version_info: true,
              });
            },
          },
        ],
      };
      const menu = Menu.buildFromTemplate([appMenu]);

      Menu.setApplicationMenu(menu);
    } catch (e) {
      console.log(e);
    }
  });
});

app.on("before-quit", function () {
  if (process.env.NODE_ENV != "development") {
    new Promise((resolve, reject) => {
      fetch("http://127.0.0.1:" + backendPort + "/rpc/Quit", {
        method: "get",
      }).then(function (response) {
        resolve(response);
      }),
        (error) => {
          reject(new Error(error.message));
        };
    });
  }
});
