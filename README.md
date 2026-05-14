# 西馬込 次のホーム

都営浅草線・西馬込駅の次発列車と番線をリアルタイムで表示する非公式Webアプリ。

## 公開URL

<!-- デプロイ後にここに追記 -->
> 公開後にVercelのURLをここへ記入してください。
> 例: https://nishimagome-board.vercel.app

---

## ODPT API 調査結果

### 利用API

| 項目 | 値 |
|---|---|
| ベースURL（公開・認証不要） | `https://api-public.odpt.org/api/v4` |
| 認証 | 不要（公開エンドポイント） |
| レート制限 | 最大1000件/リクエスト |

---

### ODPT ID 一覧

| 対象 | ODPT ID |
|---|---|
| 事業者 | `odpt.Operator:Toei` |
| 路線（都営浅草線） | `odpt.Railway:Toei.Asakusa` |
| 西馬込駅 | `odpt.Station:Toei.Asakusa.NishiMagome` |
| 進行方向（西馬込は終端駅のため北行きのみ） | `odpt.RailDirection:Northbound` |

---

### StationTimetable エンドポイント

```
GET https://api-public.odpt.org/api/v4/odpt:StationTimetable
  ?odpt:railway=odpt.Railway:Toei.Asakusa
  &odpt:station=odpt.Station:Toei.Asakusa.NishiMagome
```

レスポンスは2オブジェクト（平日・土休日）の配列。

---

### StationTimetable トップレベルフィールド

| フィールド | 型 | 例 |
|---|---|---|
| `@type` | string | `"odpt:StationTimetable"` |
| `odpt:railway` | string | `"odpt.Railway:Toei.Asakusa"` |
| `odpt:station` | string | `"odpt.Station:Toei.Asakusa.NishiMagome"` |
| `odpt:operator` | string | `"odpt.Operator:Toei"` |
| `odpt:calendar` | string | `"odpt.Calendar:Weekday"` または `"odpt.Calendar:SaturdayHoliday"` |
| `odpt:railDirection` | string | `"odpt.RailDirection:Northbound"` |
| `odpt:stationTimetableObject` | array | 各列車の時刻情報 |

---

### stationTimetableObject フィールド（各列車）

| フィールド | 型 | 必須 | 例 | 備考 |
|---|---|---|---|---|
| `odpt:trainNumber` | string | ○ | `"501T"` | 列車番号 |
| `odpt:trainType` | string | ○ | `"odpt.TrainType:Toei.Local"` | 種別ID |
| `odpt:departureTime` | string | ○ | `"05:00"` | `HH:MM` 形式 |
| `odpt:platformNumber` | string | ○ | `"1"` または `"2"` | **番線あり・確認済み** |
| `odpt:destinationStation` | string[] | ○ | `["odpt.Station:Hokuso.Hokuso.ImbaNihonIdai"]` | 行先駅ID（配列） |
| `odpt:viaRailway` | string[] | △ | `["odpt.Railway:Keisei.NaritaSkyAccess"]` | 経由路線（省略あり） |
| `odpt:isLast` | boolean | △ | `true` | 最終列車フラグ（最終のみ付与） |
| `odpt:isOrigin` | boolean | △ | `true` | 始発フラグ |

> **番線情報あり**：`odpt:platformNumber` が `"1"` または `"2"` として含まれる。西馬込駅は2面2線構造。

---

### カレンダー種別

| ODPT ID | 内容 |
|---|---|
| `odpt.Calendar:Weekday` | 平日（月〜金） |
| `odpt.Calendar:SaturdayHoliday` | 土曜・休日（土・日・祝） |

> 祝日判定はAPIデータに含まれないため、MVPでは曜日のみで判定（土日→土休日ダイヤ）。

---

### 列車種別 一覧

| ODPT ID | 日本語名 | 表示色 |
|---|---|---|
| `odpt.TrainType:Toei.Local` | 普通 | グレー |
| `odpt.TrainType:Toei.RapidLimitedExpress` | 快特 | 赤 |
| `odpt.TrainType:Toei.AirportRapidLimitedExpress` | エアポート快特 | 青 |
| `odpt.TrainType:Toei.AccessExpress` | アクセス特急 | 橙 |
| `odpt.TrainType:Toei.CommuterLimitedExpress` | 通勤特急 | 紫 |
| `odpt.TrainType:Toei.Express` | 急行 | 緑 |
| `odpt.TrainType:Toei.LimitedExpress` | 特急 | 金 |
| `odpt.TrainType:Toei.Rapid` | 快速 | 青緑 |

---

### 直通運転ネットワーク（行先駅の主要ODPT ID）

| 路線 | 主な行先 | ODPT ID 例 |
|---|---|---|
| 都営浅草線内 | 泉岳寺、押上 | `Toei.Asakusa.Sengakuji` |
| 京成押上線 | 青砥 | `Keisei.Oshiage.Aoto` |
| 京成本線 | 高砂、成田、千葉 | `Keisei.Main.Takasago` |
| 成田スカイアクセス線 | 成田空港 | `Keisei.NaritaSkyAccess.NaritaAirportTerminal1` |
| 北総線 | 印旛日本医大 | `Hokuso.Hokuso.ImbaNihonIdai` |
| 京急本線 | 品川、横浜、三崎口 | `Keikyu.Main.Yokohama` |
| 京急空港線 | 羽田空港 | `Keikyu.Airport.HanedaAirportT3` |
| 京急逗子線 | 逗子・葉山 | `Keikyu.Zushi.ZushiHayama` |

---

### 実際のデータサンプル（土休日・早朝5本）

| 列車番号 | 発車 | 番線 | 種別 | 行先 | 経由 |
|---|---|---|---|---|---|
| 501T | 05:00 | 1 | 普通 | 印旛日本医大 | なし |
| 509T | 05:07 | 1 | 普通 | 青砥 | なし |
| 511Ta | 05:18 | 1 | 普通 | 泉岳寺 | なし |
| 513T | 05:27 | 1 | 普通 | 泉岳寺 | なし |
| 579H | 05:36 | 2 | 普通 | 泉岳寺 | なし |
| 703K | （後続） | ? | アクセス特急 | — | 成田スカイアクセス |

---

### ダイヤ判定ロジック（`src/lib/calendar.ts`）

ODPT APIは2種類の時刻表を提供する（`odpt:Calendar` フィールド）：

| ODPT カレンダー ID | 適用ダイヤ |
|---|---|
| `odpt.Calendar:Weekday` | 平日（月〜金・祝日以外） |
| `odpt.Calendar:SaturdayHoliday` | 土曜・日曜・祝日 |

判定の優先順位：

1. **祝日か判定**（`@holiday-jp/holiday_jp` ライブラリ使用）
   - 国民の祝日・振替休日・国民の休日すべてに対応
   - 例: 成人の日（月曜）、振替休日（月曜）→ `SaturdayHoliday`
2. **土曜か判定** → `SaturdayHoliday`
3. **日曜か判定** → `SaturdayHoliday`
4. **それ以外** → `Weekday`

日時はブラウザのローカル時刻を使用（日本在住ユーザー = JST を前提）。

#### 祝日判定対応済み ✅

以下の日付で全件テスト通過済み：

| 日付 | 曜日・種別 | 判定結果 | 画面表示（理由） |
|---|---|---|---|
| 2026-05-14 | 木曜 | 平日ダイヤ | `木曜` |
| 2026-05-16 | 土曜 | 土休日ダイヤ | `土曜` |
| 2026-05-17 | 日曜 | 土休日ダイヤ | `日曜` |
| 2026-01-01 | 元日（木） | 土休日ダイヤ | `祝日: 元日` |
| 2026-01-12 | 成人の日（月） | 土休日ダイヤ | `祝日: 成人の日` |
| 2026-05-04 | みどりの日（月） | 土休日ダイヤ | `祝日: みどりの日` |
| 2026-05-06 | 振替休日（水） | 土休日ダイヤ | `祝日: こどもの日 振替休日` |

#### 画面右上のダイヤ表示

```
平日ダイヤ     ← メイン表示
木曜           ← 理由（小さく）
```

```
土休日ダイヤ         ← メイン表示
祝日: 成人の日       ← 理由（小さく）
```

| 状況 | メイン | 理由 |
|---|---|---|
| 月〜金（祝日以外） | 平日ダイヤ | 「月曜」〜「金曜」 |
| 土曜 | 土休日ダイヤ | 「土曜」 |
| 日曜 | 土休日ダイヤ | 「日曜」 |
| 祝日（曜日問わず） | 土休日ダイヤ | 「祝日: ○○」 |
| 振替休日 | 土休日ダイヤ | 「祝日: ○○ 振替休日」 |

### 次発判定ロジック

1. 現在時刻を取得（ブラウザのローカル時刻 = JST）
2. `getCalendarInfo(now)` で平日 / 土休日を判定（祝日対応済み）
3. 対応する時刻表オブジェクトをフィルタ
4. `odpt:departureTime`（HH:MM）を分に変換して現在時刻と比較
5. 現在時刻以降の列車を発車順にソートして表示

---

## MVPの機能・稼働状況

**ステータス: 🟢 公開準備OK（2026-05-14 最終チェック済み）**
> 実際の駅掲示板との照合済み（平日：番線・時刻・行先 一致確認済み）。

### 最終ビルドチェック結果

| 確認項目 | 結果 |
|---|---|
| `npm run build` | ✅ 成功 |
| TypeScript | ✅ エラーなし |
| ESLint | ✅ エラーなし |
| `public/manifest.json` | ✅ 有効なJSON |
| `layout.tsx` metadata | ✅ Metadata / Viewport 型定義に準拠 |
| `public/icon.svg` | ✅ 存在、manifest.json から参照 |
| `src/app/apple-icon.tsx` | ✅ edge runtime で動作（iOS用PNG、`/apple-icon` で配信） |
| Vercel デプロイ | ✅ 静的ページ(ISR) + edge動的ルート構成、問題なし |
| `.gitignore` | ✅ `.env.local` 除外済み |

- 西馬込駅の次発列車を最大12本表示
- 番線（1番線 / 2番線）をカード中央に大きく表示（スマホ最適化）
- 発車まであと何分かを表示（「まもなく」は黄色で強調）
- 種別をカラーバッジで表示（普通/快特/エアポート快特/アクセス特急 等）
- 行先駅名を日本語で表示
- 経由路線（スカイアクセス等）を表示
- 平日 / 土休日ダイヤを曜日から自動切り替え
- 30秒ごとに自動更新（最終更新時刻を画面下部に表示）
- 時刻表データは1時間キャッシュ（ISR）

---

## 番線情報の扱い

### データソースと信頼性

| 項目 | 内容 |
|---|---|
| 番線データの出所 | ODPT API の `odpt:platformNumber` フィールド |
| 信頼性 | **APIが正式に提供する値**（仮実装・推定ではない） |
| 確認状況 | 実際のAPIレスポンスで `"1"` / `"2"` が返ることを確認済み |

西馬込駅は都営浅草線の終端駅で2面2線（1番線・2番線）。ODPT APIは列車ごとに発車番線を返しており、このデータをそのまま画面に表示している。

### 手動補正の仕組み

`src/lib/platform-map.ts` に補正ロジックを集約している。

- **通常時**: APIの `odpt:platformNumber` をそのまま使用
- **補正が必要な場合**: `PLATFORM_OVERRIDES` に `列車番号 → 番線` の対応を追加する
- **APIが番線を返さない場合**: 画面に「推定」ラベルを表示し、"不明" と表示する

```typescript
// platform-map.ts
const PLATFORM_OVERRIDES: Record<string, string> = {
  // 必要に応じて追加: "501T": "1",
};
```

### 画面上の注意書き

- APIが番線情報を提供しない列車がある場合: 「番線情報をAPIから取得できなかった列車があります（推定）」と表示
- 全列車共通の注意として: **「実際の発車ホームは駅の案内表示を確認してください」** を画面下部に常時表示

---

## 今後の改善案

| 優先度 | 内容 | 概要 |
|---|---|---|
| 高 | PWA化 | `manifest.json` と Service Worker を追加し、スマホのホーム画面に追加できるようにする。オフライン時は最後のキャッシュを表示する。 |
| 中 | 祝日対応 | 現在は土日のみ土休日ダイヤ判定。祝日APIと組み合わせて正確に判定する。 |
| 中 | リアルタイム列車位置 | ODPT の `odpt:Train` エンドポイントを使い、遅延情報を表示する。 |
| 低 | ダークモード切替 | 現在は固定ダークテーマ。日中は明るい配色に切り替えるオプションを追加。 |

---

## Vercel公開手順

### 前提
- GitHubアカウント・Vercelアカウントを持っていること
- このリポジトリをGitHubにpush済みであること

### ODPT APIについて
このアプリは **ODPT公開API（認証不要）** を使用しているため、**APIキー（Consumer Key）は不要**。  
`https://api-public.odpt.org/api/v4` は誰でもアクセスできる公開エンドポイント。

将来、認証付きAPIに切り替える場合は、`src/lib/odpt.ts` の `fetchStationTimetable` 関数の URL に `?acl:consumerKey=${process.env.ODPT_CONSUMER_KEY}` を追加し、Vercelの環境変数に `ODPT_CONSUMER_KEY` を設定する。

### 手順

1. **GitHubにpushする**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/<your-username>/nishimagome-board.git
   git push -u origin main
   ```

2. **Vercelでインポートする**
   - [vercel.com/new](https://vercel.com/new) を開く
   - 「Import Git Repository」からGitHubのリポジトリを選択
   - Framework は自動で **Next.js** と検出される
   - 「Deploy」をクリック

3. **環境変数（現時点では設定不要）**
   - 現在はODPT公開APIのため、環境変数の追加は不要
   - Vercelが自動で `VERCEL_URL` を設定する（OGPのURLに使用）

4. **デプロイ完了**
   - 発行されたURL（例: `https://nishimagome-board.vercel.app`）にアクセスして動作確認

### .gitignore の確認
`.env.local`・`.env.*.local` は `.gitignore` に含まれており、Gitに含まれない設定済み。

---

## PWA（ホーム画面追加）

### スマホのホーム画面に追加する手順

**iPhoneの場合（Safari）**
1. SafariでアプリURLを開く
2. 下部の共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」を選択
4. 名前を確認して「追加」

**Androidの場合（Chrome）**
1. ChromeでアプリURLを開く
2. アドレスバー右のメニュー（⋮）をタップ
3. 「ホーム画面に追加」または「アプリをインストール」を選択

### PWA設定ファイル
| ファイル | 内容 |
|---|---|
| `public/manifest.json` | アプリ名・アイコン・テーマカラー等のPWA設定 |
| `public/icon.svg` | 1番線（青）・2番線（橙）デザインのSVGアイコン |
| `src/app/apple-icon.tsx` | iOS用PNG アイコン（180×180）|
| `src/app/layout.tsx` | `<meta name="theme-color">`・OGP・manifestリンク |

---

## セットアップ（ローカル開発）

```bash
# Node.js（v20以上）が必要

npm install
npm run dev
# → http://localhost:3000 を開く
```
