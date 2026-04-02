import { execSync } from "node:child_process";

// 需要全局安装的工具列表
const packages = ["rimraf"];

packages.forEach((pkg) => {
  try {
    // 检查是否已全局安装
    const version = execSync(`${pkg} --version`, { stdio: "pipe" })
      .toString()
      .trim();
    console.log(`[✔] ${pkg} 已安装，版本：${version}`);
  } catch {
    console.log(`[➤] ${pkg} 未安装，尝试全局安装...`);
    try {
      execSync(`npm install -g ${pkg}`, { stdio: "inherit" });
      console.log(`[✔] ${pkg} 安装成功`);
    } catch (err) {
      console.error(`[✖] 安装 ${pkg} 失败`, err);
    }
  }
});
