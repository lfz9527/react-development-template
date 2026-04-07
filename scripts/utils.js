/** 带颜色的控制台输出 */
export const log = {
  info: (...args) => console.log(`\x1b[36mℹ\x1b[0m `, ...args),
  success: (...args) => console.log(`\x1b[32m✔\x1b[0m `, ...args),
  warn: (...args) => console.log(`\x1b[33m⚠\x1b[0m `, ...args),
  error: (...args) => console.error(`\x1b[31m✖\x1b[0m `, ...args),
  title: (msg) => console.log(`\n\x1b[1m\x1b[35m${msg}\x1b[0m\n`),
}
