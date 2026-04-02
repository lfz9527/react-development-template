import { defineConfig, loadEnv } from "vite";
import { buildPlugins } from "./vite.conf/plugin";
import buildConfig from "./vite.conf/config";

export default defineConfig((conf) => {
  const { mode, command } = conf;
  const env = loadEnv(mode, process.cwd());
  const isBuild = command === "build";
  return {
    ...buildConfig({ ...conf, isBuild, env }),
    plugins: buildPlugins({ mode, isBuild, env }),
  };
});
