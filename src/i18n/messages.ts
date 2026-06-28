import type { Language } from "../types/language";

export const messages: Record<Language, Record<string, string>> = {
    ja: {
        title: "リアルタイム市場ダッシュボード",
        watchList: "監視銘柄",
        tradeStream: "取引ストリーム",
        statistics: "統計",
        connected: "接続中",
        disconnected: "未接続",
        setting: "設定",
        language: "言語",
        opening: "開場中",
        nextOpen: "次回開場まで",
        demoMode: "デモモード",
        demoRunning: "デモモードで稼働中",
        demoOff: "デモ停止中",
    },
    en: {
        title: "Live Market Dashboard",
        watchList: "Watch List",
        tradeStream: "Trade Stream",
        statistics: "Statistics",
        connected: "Connected",
        disconnected: "Disconnected",
        settings: "Settings",
        language: "Language",
        opening: "Market Open",
        nextOpen: "Next Open in",
        demoMode: "Demo Mode",
        demoRunning: "Running in Demo Mode",
        demoOff: "Demo Off",
    },
};