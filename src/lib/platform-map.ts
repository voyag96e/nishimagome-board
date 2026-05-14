// 番線情報の管理ファイル
//
// 西馬込駅の番線情報は ODPT API の odpt:platformNumber フィールドで提供されており、
// 現時点では API の値をそのまま使用している。
//
// API が番線情報を返さない場合や、実際の運用と乖離が生じた場合は、
// 下記の PLATFORM_OVERRIDES に列車番号→番線の対応を追加して手動補正できる。
// 例: "501T": "1"

const PLATFORM_OVERRIDES: Record<string, string> = {};

export interface PlatformInfo {
  platform: string;
  isEstimated: boolean;
}

export function getPlatformInfo(
  trainNumber: string,
  apiPlatformNumber: string | undefined
): PlatformInfo {
  if (PLATFORM_OVERRIDES[trainNumber]) {
    return { platform: PLATFORM_OVERRIDES[trainNumber], isEstimated: false };
  }
  if (apiPlatformNumber) {
    return { platform: apiPlatformNumber, isEstimated: false };
  }
  return { platform: "?", isEstimated: true };
}

export function formatPlatform(platform: string): string {
  if (platform === "?") return "不明";
  return `${platform}番線`;
}
