// 駅ID → 日本語駅名のマッピング（都営浅草線直通運転ネットワーク）
export const STATION_NAMES: Record<string, string> = {
  // 都営浅草線
  "odpt.Station:Toei.Asakusa.NishiMagome": "西馬込",
  "odpt.Station:Toei.Asakusa.Magome": "馬込",
  "odpt.Station:Toei.Asakusa.Nakanobu": "中延",
  "odpt.Station:Toei.Asakusa.Togoshi": "戸越",
  "odpt.Station:Toei.Asakusa.Gotanda": "五反田",
  "odpt.Station:Toei.Asakusa.Takanawadai": "高輪台",
  "odpt.Station:Toei.Asakusa.Sengakuji": "泉岳寺",
  "odpt.Station:Toei.Asakusa.Mita": "三田",
  "odpt.Station:Toei.Asakusa.Daimon": "大門",
  "odpt.Station:Toei.Asakusa.Shimbashi": "新橋",
  "odpt.Station:Toei.Asakusa.HigashiGinza": "東銀座",
  "odpt.Station:Toei.Asakusa.Takaracho": "宝町",
  "odpt.Station:Toei.Asakusa.Nihombashi": "日本橋",
  "odpt.Station:Toei.Asakusa.Ningyocho": "人形町",
  "odpt.Station:Toei.Asakusa.HigashiNihombashi": "東日本橋",
  "odpt.Station:Toei.Asakusa.Asakusabashi": "浅草橋",
  "odpt.Station:Toei.Asakusa.Kuramae": "蔵前",
  "odpt.Station:Toei.Asakusa.Asakusa": "浅草",
  "odpt.Station:Toei.Asakusa.HonjoAzumabashi": "本所吾妻橋",
  "odpt.Station:Toei.Asakusa.Oshiage": "押上",
  // 京成押上線
  "odpt.Station:Keisei.Oshiage.Oshiage": "押上",
  "odpt.Station:Keisei.Oshiage.Hikifune": "曳舟",
  "odpt.Station:Keisei.Oshiage.Keisei-Tateishi": "京成立石",
  "odpt.Station:Keisei.Oshiage.Aoto": "青砥",
  // 京成本線
  "odpt.Station:Keisei.Main.Aoto": "青砥",
  "odpt.Station:Keisei.Main.Takasago": "高砂",
  "odpt.Station:Keisei.Main.Keisei-Koenji": "京成小岩",
  "odpt.Station:Keisei.Main.Keisei-Funabashi": "京成船橋",
  "odpt.Station:Keisei.Main.Narita": "成田",
  "odpt.Station:Keisei.Main.Chiba": "千葉",
  "odpt.Station:Keisei.Main.ChibaChuo": "千葉中央",
  "odpt.Station:Keisei.Main.Matsudo": "松戸",
  "odpt.Station:Keisei.Main.Sakura": "佐倉",
  "odpt.Station:Keisei.Main.NaritaAirportTerminal1": "成田空港",
  "odpt.Station:Keisei.Main.NaritaAirportTerminal2and3": "空港第2ビル",
  // 成田スカイアクセス線
  "odpt.Station:Keisei.NaritaSkyAccess.NaritaAirportTerminal1": "成田空港",
  "odpt.Station:Keisei.NaritaSkyAccess.NaritaAirportTerminal2and3": "空港第2ビル",
  "odpt.Station:Keisei.NaritaSkyAccess.ImbaNihonIdai": "印旛日本医大",
  // 北総線
  "odpt.Station:Hokuso.Hokuso.ImbaNihonIdai": "印旛日本医大",
  "odpt.Station:Hokuso.Hokuso.Impresscity-Chiba-NT-Chuo": "印西牧の原",
  "odpt.Station:Hokuso.Hokuso.InzaiMakinohara": "印西牧の原",
  "odpt.Station:Hokuso.Hokuso.Inzai-Makinohara": "印西牧の原",
  "odpt.Station:Hokuso.Hokuso.ChibaNewTownChuo": "千葉ニュータウン中央",
  "odpt.Station:Hokuso.Hokuso.HigashiMatsudo": "東松戸",
  // 京急本線
  "odpt.Station:Keikyu.Main.Shinagawa": "品川",
  "odpt.Station:Keikyu.Main.Yokohama": "横浜",
  "odpt.Station:Keikyu.Main.Kamiooka": "上大岡",
  "odpt.Station:Keikyu.Main.KanazawaBunko": "金沢文庫",
  "odpt.Station:Keikyu.Main.KanazawaHakkei": "金沢八景",
  "odpt.Station:Keikyu.Main.Kurihama": "久里浜",
  "odpt.Station:Keikyu.Main.Uraga": "浦賀",
  // 京急逗子線
  "odpt.Station:Keikyu.Zushi.ZushiHayama": "逗子・葉山",
  "odpt.Station:Keikyu.Zushi.Misakiguchi": "三崎口",
  // 京急空港線
  "odpt.Station:Keikyu.Airport.HanedaAirportT3": "羽田空港第3ターミナル",
  "odpt.Station:Keikyu.Airport.HanedaAirportT12": "羽田空港第1・2ターミナル",
  "odpt.Station:Keikyu.Airport.HanedaAirportTerminal1And2": "羽田空港第1・2ターミナル",
  // 芝山鉄道
  "odpt.Station:Shibayama.Shibayama.ShibayamaChiyoda": "芝山千代田",
};

// 経由路線ID → 日本語名
export const RAILWAY_NAMES: Record<string, string> = {
  "odpt.Railway:Toei.Asakusa": "都営浅草線",
  "odpt.Railway:Keisei.Main": "京成本線",
  "odpt.Railway:Keisei.Oshiage": "京成押上線",
  "odpt.Railway:Keisei.NaritaSkyAccess": "成田スカイアクセス",
  "odpt.Railway:Hokuso.Hokuso": "北総線",
  "odpt.Railway:Keikyu.Main": "京急本線",
  "odpt.Railway:Keikyu.Airport": "京急空港線",
  "odpt.Railway:Keikyu.Zushi": "京急逗子線",
  "odpt.Railway:Shibayama.Shibayama": "芝山鉄道",
};

// 種別ID → { 日本語名, Tailwind背景色クラス, Tailwind文字色クラス }
export const TRAIN_TYPES: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  "odpt.TrainType:Toei.Local": {
    label: "普通",
    bg: "bg-gray-500",
    text: "text-white",
  },
  "odpt.TrainType:Toei.RapidLimitedExpress": {
    label: "快特",
    bg: "bg-red-600",
    text: "text-white",
  },
  "odpt.TrainType:Toei.AirportRapidLimitedExpress": {
    label: "エアポート快特",
    bg: "bg-blue-600",
    text: "text-white",
  },
  "odpt.TrainType:Toei.AccessExpress": {
    label: "アクセス特急",
    bg: "bg-orange-500",
    text: "text-white",
  },
  "odpt.TrainType:Toei.CommuterLimitedExpress": {
    label: "通勤特急",
    bg: "bg-purple-600",
    text: "text-white",
  },
  "odpt.TrainType:Toei.Express": {
    label: "急行",
    bg: "bg-green-600",
    text: "text-white",
  },
  "odpt.TrainType:Toei.LimitedExpress": {
    label: "特急",
    bg: "bg-yellow-500",
    text: "text-black",
  },
  "odpt.TrainType:Toei.Rapid": {
    label: "快速",
    bg: "bg-teal-600",
    text: "text-white",
  },
};

// 駅IDの末尾短縮形 → 日本語駅名（STATION_NAMES に存在しない場合のフォールバック）
export const DESTINATION_SHORT_NAMES: Record<string, string> = {
  // 京成本線
  "KeiseiNarita": "京成成田",
  "KeiseiTakasago": "京成高砂",
  "KeiseiUeno": "京成上野",
  "KeiseiChiba": "京成千葉",
  "Keisei-Koenji": "京成小岩",
  "Keisei-Funabashi": "京成船橋",
  "Narita": "成田",
  "Takasago": "高砂",
  "Aoto": "青砥",
  "Sakura": "佐倉",
  "Matsudo": "松戸",
  "Chiba": "千葉",
  "ChibaChuo": "千葉中央",
  // 成田スカイアクセス / 北総線 / 芝山鉄道
  "NaritaAirportTerminal1": "成田空港",
  "NaritaAirportTerminal2and3": "空港第2ビル",
  "ImbaNihonIdai": "印旛日本医大",
  "Impresscity-Chiba-NT-Chuo": "印西牧の原",
  "InzaiMakinohara": "印西牧の原",
  "Inzai-Makinohara": "印西牧の原",
  "ChibaNewTownChuo": "千葉ニュータウン中央",
  "HigashiMatsudo": "東松戸",
  "ShibayamaChiyoda": "芝山千代田",
  // 京急本線
  "Shinagawa": "品川",
  "Yokohama": "横浜",
  "Kamiooka": "上大岡",
  "KanazawaBunko": "金沢文庫",
  "KanazawaHakkei": "金沢八景",
  "Kurihama": "久里浜",
  "Uraga": "浦賀",
  "ZushiHayama": "逗子・葉山",
  "Misakiguchi": "三崎口",
  "HanedaAirportT3": "羽田空港第3ターミナル",
  "HanedaAirportT12": "羽田空港第1・2ターミナル",
  "HanedaAirportTerminal1And2": "羽田空港第1・2ターミナル",
};

// 種別IDの末尾短縮形 → 日本語種別名（TRAIN_TYPES に存在しない場合のフォールバック）
export const TRAIN_TYPE_SHORT_NAMES: Record<string, string> = {
  "Local": "普通",
  "Express": "急行",
  "Rapid": "快速",
  "LimitedExpress": "特急",
  "RapidLimitedExpress": "快特",
  "CommuterLimitedExpress": "通勤特急",
  "CommuterExpress": "通勤急行",
  "CommuterRapid": "通勤快速",
  "AirportRapidLimitedExpress": "エアポート快特",
  "AccessExpress": "アクセス特急",
  "Access-Express": "アクセス特急",
  "AirportExpress": "エアポート急行",
  "SemiExpress": "準急",
  "Morning-Wing": "モーニング・ウィング号",
  "Evening-Wing": "イブニング・ウィング号",
};

// 不明な駅IDから日本語名にフォールバック変換
export function getStationName(id: string): string {
  if (STATION_NAMES[id]) return STATION_NAMES[id];
  const shortName = id.split(".").pop() ?? id;
  return DESTINATION_SHORT_NAMES[shortName] ?? shortName;
}

export function getRailwayName(id: string): string {
  return RAILWAY_NAMES[id] ?? id.split(":")[1] ?? id;
}

export function getTrainType(typeId: string) {
  if (TRAIN_TYPES[typeId]) return TRAIN_TYPES[typeId];
  const shortName = typeId.split(".").pop() ?? typeId;
  const label = TRAIN_TYPE_SHORT_NAMES[shortName] ?? shortName;
  return { label, bg: "bg-gray-400", text: "text-white" };
}
