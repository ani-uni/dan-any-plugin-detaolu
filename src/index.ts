import type { Config as DeTaoLuConfig } from "./pakku.js/index.ts";

import { UniChunk } from "@dan-uni/dan-any/core";

import pakkujs from "./pakku.js/index.ts";
import { BiliCommonModeRec, definePlugin, enumPoolCodec } from "@dan-uni/dan-any/adapters";
import { getStatsTransformerConfigurator, getStatsUtil4getMost } from "@dan-uni/dan-any/plugins";

export const detaoluPluginConfigurator = (config?: DeTaoLuConfig) =>
  definePlugin(async (uchunk) => {
    const chunk = await UniChunk.makeChunk(uchunk, {});
    const p = await pakkujs(
      {
        objs: (await uchunk.$danmakus).map((d) => ({
          time_ms: d.progress,
          mode: BiliCommonModeRec(d.mode),
          content: d.content,
          pool: enumPoolCodec.encode(d.pool)!, // encode结果的实际类型是 Pools 而非 Pools|undefined
          // danuni_sender: d.senderID,
          danuni_dan: d,
        })),
      },
      config,
    );
    // 对于任意cluster，其弹幕被视为相似，取合并值
    const now = new Date();
    const selected = p.clusters.map(async (p) => {
      if (p.danuni_dans.length === 1) {
        return p.danuni_dans[0].danuni_dan;
      } else {
        const dans = p.danuni_dans.map((d) => d.danuni_dan);
        const stats = await getStatsTransformerConfigurator(["color", "pool", "platform"])(
          Promise.resolve(dans),
        );
        const progress = dans.map((d) => d.progress);
        const map_d = {
          ctime: now,
          SOID: dans[0].SOID,
          progress: dans[0].progress,
          mode: new Set(dans.map((d) => d.mode)).size === 1 ? dans[0].mode : "Top",
          fontsize: dans.length > 10 ? 25 : 36,
          color: getStatsUtil4getMost(stats.color).val ?? dans[0].color,
          senderID: "detaolu[bot]@dan-any",
          content: p.chosen_str,
          weight: 10,
          pool: getStatsUtil4getMost(stats.pool).val ?? dans[0].pool,
          attr: ["Protect" as const],
          platform: getStatsUtil4getMost(stats.platform).val ?? dans[0].platform,
          extra: {
            danuni: {
              merge: {
                count: p.danuni_count,
                duration: Number.parseFloat(
                  (Math.max(...progress) - Math.min(...progress)).toFixed(3),
                ),
                senders: dans.filter((d) => d.content === p.chosen_str).map((d) => d.senderID),
                taolu_count: dans.length,
                taolu_senders: dans.map((d) => d.senderID),
              },
            },
          },
        };
        return { ...map_d, DMID: uchunk.$UniDB.DMIDGenerator(map_d) };
      }
    });
    await chunk.upsertDanmakus(await Promise.all(selected), false);
    return chunk;
  });
