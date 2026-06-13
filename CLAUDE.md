# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概要

React 开发模板，技术栈: React 19 + TypeScript 5.9 + Vite 8 (rolldown) + React Router 7 + Zustand 5。包管理器使用 pnpm。

## 常用命令

```bash
pnpm dev              # 启动开发服务器 (port 9529, 自动打开浏览器)
pnpm build            # tsc 类型检查 + vite 构建
pnpm lint             # ESLint 检查
pnpm lint:fix         # ESLint 自动修复
pnpm format           # Prettier 格式化
pnpm preview          # 预览生产构建
pnpm commit           # 使用 commitizen 交互式提交
pnpm globalInstall    # 安装全局工具 (如 rimraf)
pnpm clean            # 删除 node_modules 和 lock 文件
```

## 架构概览

### 入口与渲染层

`src/main.tsx` 是整个应用的入口，渲染链路:

```
createRoot → StrictMode → ErrorBoundary(GlobalCrash) → App
```

- `ErrorBoundary` 是 class 组件，包裹整个应用捕获渲染错误，显示 `GlobalCrash` 回退 UI 并支持重试
- `createRoot` 配置了 `onCaughtError`、`onUncaughtError`、`onRecoverableError` 回调用于日志

### 路由系统

路由核心文件: `src/router/`

**路由定义** (`src/router/routes.tsx`): 使用自定义的 `AppRouteObject` 类型 (拓展了 react-router 的 `RouteObject`)，支持 `meta`（标题等）和 `envs`（环境过滤）。

**路由构建** (`src/router/utils/index.ts`): `buildRouter()` 将 `AppRouteObject[]` 转换为 react-router 的 `RouteObject[]`，同时按当前 `NODE_ENV` 过滤不符合环境的路由。

**路由守卫** (`src/router/guards/BasicGuard.tsx`): 根路由的 element，通过 `useMatches()` 获取当前匹配路由的 `handle.title`，用 `useDocumentTitle` 同步浏览器标题。

**懒加载**: 所有页面通过 `Lazy(() => import(...))` 实现代码分割，包装了 `Suspense` + `Loading` 组件作为 fallback。

### HTTP 服务层

`src/service/` 目录下封装了完整的 HTTP 客户端：

- **HttpClient** (`HttpClient.ts`): 核心类，支持适配器模式（默认 `FetchAdapter`）、拦截器链（请求/响应/错误）、重试（指数退避）、`fork()` 创建子实例
- **预置实例** (`request.ts`): 导出一个配置好的 `http` 实例，注册了响应拦截器来解包业务返回格式 `{ code, data, message }`（`code !== 0` 时抛出错误）
- **业务 API** (`index.ts`): 基于 `http` 实例封装的具体接口调用

### 组件

| 组件                    | 用途                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| `ErrorBoundary`         | class 组件，捕获子组件渲染错误，支持 `resetKeys` 变化自动恢复       |
| `RouteErrorBoundary`    | 封装 ErrorBoundary，`resetKeys` 绑定 `pathname`，路由切换时自动恢复 |
| `LazyImport` / `Lazy()` | `Suspense` 包装器，统一懒加载回退 UI                                |
| `Loading`               | SVG 加载动画（通过 unplugin-icons 导入本地 SVG）                    |
| `Access`                | 条件渲染，`disable` 为 true 时显示 `fallback`                       |
| `AutoTooltip`           | 文本溢出时自动显示 Tooltip                                          |

### Hooks

17 个通用 hooks 统一从 `@/hooks` 导出，包含: `useBoolean`, `useCounter`, `useCountdown`, `useDebounceFn`, `useDebounceValue`, `useDocumentTitle`, `useErrorBoundary`, `useEventListener`, `useInterval`, `useIsMobile`, `useLatest`, `useRequest`, `useScrollLock`, `useStorage`, `useThrottledFn`, `useTimeout`, `useUnmount`, `useComposedRef`。

### 状态管理

项目安装了 Zustand 5，stores 目录为空，按需在 `src/stores/` 下创建。

### Vite 配置

- **路径别名**: `@` → `src/`
- **开发代理**: `/api` → `http://localhost:3000`
- **构建输出**: `dist/{mode}_{version}/`（如 `dist/production_0.0.0/`）
- **插件**: React、unplugin-icons（本地 SVG → React 组件）、stylelint（自动修复）、env-parse（从 `.env` 自动生成 `src/types/env.d.ts`）、gzip 压缩、构建分析（`VITE_BUILD_ANALYZE=true` 时开启）
- **Sourcemap**: 通过 `VITE_BUILD_SOURCEMAP` 环境变量控制

### Git 提交规范

- 使用 commitizen + cz-customizable，`pnpm commit` 交互式选择提交类型（feat/fix/ui/style/refactor 等）
- Husky + lint-staged: pre-commit 自动执行 ESLint 修复和 Prettier 格式化
- Husky + commitlint: commit-msg 校验提交信息格式
