import { type ConfigEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";
import { envParse, parseLoadedEnv } from "vite-plugin-env-parse";
import { visualizer } from "rollup-plugin-visualizer";

import type { ImportMetaEnv } from "../src/types/env";

type Props = {
  mode: ConfigEnv["mode"];
  isBuild: boolean;
  env: Record<string, string>;
};

export const buildPlugins = ({ env, isBuild }: Props) => {
  const viteEnv = parseLoadedEnv(env) as ImportMetaEnv;

  const plugins: PluginOption[] = [
    react(),

    // 更具env 自动生成全局类型
    envParse({
      dtsPath: "src/types/env.d.ts",
    }),

    // 压缩gzip格式
    isBuild &&
      viteEnv.VITE_BUILD_COMPRESS?.split(",").includes("gzip") &&
      compression({
        algorithms: ["gzip"],
      }),

    // 代码分析
    viteEnv.VITE_BUILD_ANALYZE &&
      visualizer({
        open: true, // 打包后自动打开浏览器
        gzipSize: true, // 显示 gzip 后体积
        brotliSize: true, // 显示 brotli 后体积
        filename: "analyze.html", // 生成的报告文件名
      }),
  ];

  return plugins;
};
