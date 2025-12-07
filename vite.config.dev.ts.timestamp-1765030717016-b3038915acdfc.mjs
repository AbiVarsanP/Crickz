// vite.config.dev.ts
import { defineConfig, loadConfigFromFile } from "file:///C:/Users/ABIVARSAN/Downloads/app-81mdtfyidaf5/node_modules/.pnpm/vite@5.4.19_@types+node@24.2.1_lightningcss@1.30.1/node_modules/vite/dist/node/index.js";
import path from "path";
import {
  makeTagger,
  injectedGuiListenerPlugin,
  injectOnErrorPlugin
} from "file:///C:/Users/ABIVARSAN/Downloads/app-81mdtfyidaf5/node_modules/.pnpm/miaoda-sc-plugin@1.0.29_vit_a4fa82c5b4791adc6b77ec24410682bf/node_modules/miaoda-sc-plugin/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\ABIVARSAN\\Downloads\\app-81mdtfyidaf5";
var env = { command: "serve", mode: "development" };
var configFile = path.resolve(__vite_injected_original_dirname, "vite.config.ts");
var result = await loadConfigFromFile(env, configFile);
var userConfig = result?.config;
var vite_config_dev_default = defineConfig({
  ...userConfig,
  plugins: [
    makeTagger(),
    injectedGuiListenerPlugin({
      path: "https://miaoda-resource-static.s3cdn.medo.dev/common/v2/injected.js"
    }),
    injectOnErrorPlugin(),
    ...userConfig?.plugins || [],
    {
      name: "hmr-toggle",
      configureServer(server) {
        let hmrEnabled = true;
        const _send = server.ws.send;
        server.ws.send = (payload) => {
          if (hmrEnabled) {
            return _send.call(server.ws, payload);
          } else {
            console.log("[HMR disabled] skipped payload:", payload.type);
          }
        };
        server.middlewares.use("/innerapi/v1/sourcecode/__hmr_off", (req, res) => {
          hmrEnabled = false;
          let body = {
            status: 0,
            msg: "HMR disabled"
          };
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        });
        server.middlewares.use("/innerapi/v1/sourcecode/__hmr_on", (req, res) => {
          hmrEnabled = true;
          let body = {
            status: 0,
            msg: "HMR enabled"
          };
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        });
        server.middlewares.use("/innerapi/v1/sourcecode/__hmr_reload", (req, res) => {
          if (hmrEnabled) {
            server.ws.send({
              type: "full-reload",
              path: "*"
              // 整页刷新
            });
          }
          res.statusCode = 200;
          let body = {
            status: 0,
            msg: "Manual full reload triggered"
          };
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        });
      },
      load(id) {
        if (id === "virtual:after-update") {
          return `
        if (import.meta.hot) {
          import.meta.hot.on('vite:afterUpdate', () => {
            window.postMessage(
              {
                type: 'editor-update'
              },
              '*'
            );
          });
        }
      `;
        }
      },
      transformIndexHtml(html) {
        return {
          html,
          tags: [
            {
              tag: "script",
              attrs: {
                type: "module",
                src: "/@id/virtual:after-update"
              },
              injectTo: "body"
            }
          ]
        };
      }
    }
  ]
});
export {
  vite_config_dev_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuZGV2LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQUJJVkFSU0FOXFxcXERvd25sb2Fkc1xcXFxhcHAtODFtZHRmeWlkYWY1XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBQklWQVJTQU5cXFxcRG93bmxvYWRzXFxcXGFwcC04MW1kdGZ5aWRhZjVcXFxcdml0ZS5jb25maWcuZGV2LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9BQklWQVJTQU4vRG93bmxvYWRzL2FwcC04MW1kdGZ5aWRhZjUvdml0ZS5jb25maWcuZGV2LnRzXCI7XG4gICAgaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkQ29uZmlnRnJvbUZpbGUgfSBmcm9tIFwidml0ZVwiO1xuICAgIGltcG9ydCB0eXBlIHsgUGx1Z2luLCBDb25maWdFbnYgfSBmcm9tIFwidml0ZVwiO1xuICAgIGltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwidGFpbHdpbmRjc3NcIjtcbiAgICBpbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIjtcbiAgICBpbXBvcnQgZnMgZnJvbSBcImZzL3Byb21pc2VzXCI7XG4gICAgaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbiAgICBpbXBvcnQge1xuICAgICAgbWFrZVRhZ2dlcixcbiAgICAgIGluamVjdGVkR3VpTGlzdGVuZXJQbHVnaW4sXG4gICAgICBpbmplY3RPbkVycm9yUGx1Z2luXG4gICAgfSBmcm9tIFwibWlhb2RhLXNjLXBsdWdpblwiO1xuXG4gICAgY29uc3QgZW52OiBDb25maWdFbnYgPSB7IGNvbW1hbmQ6IFwic2VydmVcIiwgbW9kZTogXCJkZXZlbG9wbWVudFwiIH07XG4gICAgY29uc3QgY29uZmlnRmlsZSA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwidml0ZS5jb25maWcudHNcIik7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbG9hZENvbmZpZ0Zyb21GaWxlKGVudiwgY29uZmlnRmlsZSk7XG4gICAgY29uc3QgdXNlckNvbmZpZyA9IHJlc3VsdD8uY29uZmlnO1xuXG4gICAgZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICAgIC4uLnVzZXJDb25maWcsXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIG1ha2VUYWdnZXIoKSxcbiAgICAgICAgaW5qZWN0ZWRHdWlMaXN0ZW5lclBsdWdpbih7XG4gICAgICAgICAgcGF0aDogJ2h0dHBzOi8vbWlhb2RhLXJlc291cmNlLXN0YXRpYy5zM2Nkbi5tZWRvLmRldi9jb21tb24vdjIvaW5qZWN0ZWQuanMnXG4gICAgICAgIH0pLFxuICAgICAgICBpbmplY3RPbkVycm9yUGx1Z2luKCksXG4gICAgICAgIC4uLih1c2VyQ29uZmlnPy5wbHVnaW5zIHx8IFtdKSxcbiAgICAgICAgXG57XG4gIG5hbWU6ICdobXItdG9nZ2xlJyxcbiAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgIGxldCBobXJFbmFibGVkID0gdHJ1ZTtcblxuICAgIC8vIFx1NTMwNVx1ODhDNVx1NTM5Rlx1Njc2NVx1NzY4NCBzZW5kIFx1NjVCOVx1NkNENVxuICAgIGNvbnN0IF9zZW5kID0gc2VydmVyLndzLnNlbmQ7XG4gICAgc2VydmVyLndzLnNlbmQgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgaWYgKGhtckVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIF9zZW5kLmNhbGwoc2VydmVyLndzLCBwYXlsb2FkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbSE1SIGRpc2FibGVkXSBza2lwcGVkIHBheWxvYWQ6JywgcGF5bG9hZC50eXBlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gXHU2M0QwXHU0RjlCXHU2M0E1XHU1M0UzXHU1MjA3XHU2MzYyIEhNUlxuICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9pbm5lcmFwaS92MS9zb3VyY2Vjb2RlL19faG1yX29mZicsIChyZXEsIHJlcykgPT4ge1xuICAgICAgaG1yRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgbGV0IGJvZHkgPSB7XG4gICAgICAgICAgc3RhdHVzOiAwLFxuICAgICAgICAgIG1zZzogJ0hNUiBkaXNhYmxlZCdcbiAgICAgIH07XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShib2R5KSk7XG4gICAgfSk7XG5cbiAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvaW5uZXJhcGkvdjEvc291cmNlY29kZS9fX2htcl9vbicsIChyZXEsIHJlcykgPT4ge1xuICAgICAgaG1yRW5hYmxlZCA9IHRydWU7XG4gICAgICBsZXQgYm9keSA9IHtcbiAgICAgICAgICBzdGF0dXM6IDAsXG4gICAgICAgICAgbXNnOiAnSE1SIGVuYWJsZWQnXG4gICAgICB9O1xuICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoYm9keSkpO1xuICAgIH0pO1xuXG4gICAgLy8gXHU2Q0U4XHU1MThDXHU0RTAwXHU0RTJBIEhUVFAgQVBJXHVGRjBDXHU3NTI4XHU2NzY1XHU2MjRCXHU1MkE4XHU4OUU2XHU1M0QxXHU0RTAwXHU2QjIxXHU2NTc0XHU0RjUzXHU1MjM3XHU2NUIwXG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2lubmVyYXBpL3YxL3NvdXJjZWNvZGUvX19obXJfcmVsb2FkJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBpZiAoaG1yRW5hYmxlZCkge1xuICAgICAgICBzZXJ2ZXIud3Muc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ2Z1bGwtcmVsb2FkJyxcbiAgICAgICAgICBwYXRoOiAnKicsIC8vIFx1NjU3NFx1OTg3NVx1NTIzN1x1NjVCMFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgbGV0IGJvZHkgPSB7XG4gICAgICAgICAgc3RhdHVzOiAwLFxuICAgICAgICAgIG1zZzogJ01hbnVhbCBmdWxsIHJlbG9hZCB0cmlnZ2VyZWQnXG4gICAgICB9O1xuICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoYm9keSkpO1xuICAgIH0pO1xuICB9LFxuICBsb2FkKGlkKSB7XG4gICAgaWYgKGlkID09PSAndmlydHVhbDphZnRlci11cGRhdGUnKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICBpZiAoaW1wb3J0Lm1ldGEuaG90KSB7XG4gICAgICAgICAgaW1wb3J0Lm1ldGEuaG90Lm9uKCd2aXRlOmFmdGVyVXBkYXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2VkaXRvci11cGRhdGUnXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcqJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgYDtcbiAgICB9XG4gIH0sXG4gIHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGh0bWwsXG4gICAgICB0YWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0YWc6ICdzY3JpcHQnLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICB0eXBlOiAnbW9kdWxlJyxcbiAgICAgICAgICAgIHNyYzogJy9AaWQvdmlydHVhbDphZnRlci11cGRhdGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpbmplY3RUbzogJ2JvZHknXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59LFxuXG4gICAgICBdXG4gICAgfSk7XG4gICAgIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNJLFNBQVMsY0FBYywwQkFBMEI7QUFLakQsT0FBTyxVQUFVO0FBQ2pCO0FBQUEsRUFDRTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsT0FDSztBQVhYLElBQU0sbUNBQW1DO0FBYXJDLElBQU0sTUFBaUIsRUFBRSxTQUFTLFNBQVMsTUFBTSxjQUFjO0FBQy9ELElBQU0sYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQzNELElBQU0sU0FBUyxNQUFNLG1CQUFtQixLQUFLLFVBQVU7QUFDdkQsSUFBTSxhQUFhLFFBQVE7QUFFM0IsSUFBTywwQkFBUSxhQUFhO0FBQUEsRUFDMUIsR0FBRztBQUFBLEVBQ0gsU0FBUztBQUFBLElBQ1AsV0FBVztBQUFBLElBQ1gsMEJBQTBCO0FBQUEsTUFDeEIsTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUFBLElBQ0Qsb0JBQW9CO0FBQUEsSUFDcEIsR0FBSSxZQUFZLFdBQVcsQ0FBQztBQUFBLElBRXBDO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsUUFBUTtBQUN0QixZQUFJLGFBQWE7QUFHakIsY0FBTSxRQUFRLE9BQU8sR0FBRztBQUN4QixlQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVk7QUFDNUIsY0FBSSxZQUFZO0FBQ2QsbUJBQU8sTUFBTSxLQUFLLE9BQU8sSUFBSSxPQUFPO0FBQUEsVUFDdEMsT0FBTztBQUNMLG9CQUFRLElBQUksbUNBQW1DLFFBQVEsSUFBSTtBQUFBLFVBQzdEO0FBQUEsUUFDRjtBQUdBLGVBQU8sWUFBWSxJQUFJLHFDQUFxQyxDQUFDLEtBQUssUUFBUTtBQUN4RSx1QkFBYTtBQUNiLGNBQUksT0FBTztBQUFBLFlBQ1AsUUFBUTtBQUFBLFlBQ1IsS0FBSztBQUFBLFVBQ1Q7QUFDQSxjQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUNoRCxjQUFJLElBQUksS0FBSyxVQUFVLElBQUksQ0FBQztBQUFBLFFBQzlCLENBQUM7QUFFRCxlQUFPLFlBQVksSUFBSSxvQ0FBb0MsQ0FBQyxLQUFLLFFBQVE7QUFDdkUsdUJBQWE7QUFDYixjQUFJLE9BQU87QUFBQSxZQUNQLFFBQVE7QUFBQSxZQUNSLEtBQUs7QUFBQSxVQUNUO0FBQ0EsY0FBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsY0FBSSxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUM7QUFBQSxRQUM5QixDQUFDO0FBR0QsZUFBTyxZQUFZLElBQUksd0NBQXdDLENBQUMsS0FBSyxRQUFRO0FBQzNFLGNBQUksWUFBWTtBQUNkLG1CQUFPLEdBQUcsS0FBSztBQUFBLGNBQ2IsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBO0FBQUEsWUFDUixDQUFDO0FBQUEsVUFDSDtBQUNBLGNBQUksYUFBYTtBQUNqQixjQUFJLE9BQU87QUFBQSxZQUNQLFFBQVE7QUFBQSxZQUNSLEtBQUs7QUFBQSxVQUNUO0FBQ0EsY0FBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsY0FBSSxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUM7QUFBQSxRQUM5QixDQUFDO0FBQUEsTUFDSDtBQUFBLE1BQ0EsS0FBSyxJQUFJO0FBQ1AsWUFBSSxPQUFPLHdCQUF3QjtBQUNqQyxpQkFBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQVlUO0FBQUEsTUFDRjtBQUFBLE1BQ0EsbUJBQW1CLE1BQU07QUFDdkIsZUFBTztBQUFBLFVBQ0w7QUFBQSxVQUNBLE1BQU07QUFBQSxZQUNKO0FBQUEsY0FDRSxLQUFLO0FBQUEsY0FDTCxPQUFPO0FBQUEsZ0JBQ0wsTUFBTTtBQUFBLGdCQUNOLEtBQUs7QUFBQSxjQUNQO0FBQUEsY0FDQSxVQUFVO0FBQUEsWUFDWjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUVNO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
