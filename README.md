# @dan-uni/dan-any-plugin-detaolu

`@dan-uni/dan-any-plugin-detaolu` 基于 `pakku.js` 的思路实现了一套弹幕去重 / 反套路（反“taolu”）合并插件，用于在 `dan-any` 数据流中把相似或重复的弹幕聚合为代表弹幕。

主要功能

- 使用相似度算法（编辑距离、2-gram 词频向量、拼音归一化等）识别并合并相近弹幕
- 提供 `DetaoluPluginConfigurator` 作为 `dan-any` plugin，直接用于 `chunk.plugin(...)`
- 暴露可配置项（参见 `src/pakku.js/index.ts` 中的 `DEFAULT_CONFIG`）以调节合并策略

快速开始

```bash
vp install
vp test
vp pack
```

使用示例

```ts
import { DetaoluPluginConfigurator } from "@dan-uni/dan-any-plugin-detaolu";

// 在 dan-any 的处理链中使用：
const mergedChunk = await chunk.plugin(DetaoluPluginConfigurator({ THRESHOLD: 30 }));
// mergedChunk 包含合并/聚合后的弹幕
```

配置

- 默认配置项位于 `src/pakku.js/index.ts` 中的 `DEFAULT_CONFIG`，包含合并阈值、编辑距离阈值、词频相似度阈值、白名单/黑名单与若干文本预处理选项。

许可与致谢

- 本包采用 GPL-3.0-or-later 许可（详见 `package.json`）。
- 相似度与合并逻辑源自并改编自开源项目 `pakku.js`（参见源码注释），请注意原作者许可约束。

贡献

- 欢迎提交 issue 与 PR。提交前请运行 `vp check` 与 `vp test` 并确保遵守 GPL 兼容要求。

更多

- 源码主要位于 `src/pakku.js`（实现合并算法与 wasm 加载）和 `src/index.ts`（提供 `DetaoluPluginConfigurator` 集成点）。
