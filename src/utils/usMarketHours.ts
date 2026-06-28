export type MarketSessionInfo = {
    isOpen: boolean;
    nextOpenAt: Date | null;
    nextCloseAt: Date | null;
};

const MARKET_TIME_ZONE = "America/New_York";

function getParts(date: Date) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: MARKET_TIME_ZONE,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    }).formatToParts(date);

    return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

function getTimeZoneOffsetMs(date: Date): number {
    const parts = getParts(date);

    const utcAsIfLocal = Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute)
    );

    return utcAsIfLocal - date.getTime();
}

function zonedTimeToUtc(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number
): Date {
    const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
    const offset = getTimeZoneOffsetMs(new Date(utcGuess));

    return new Date(utcGuess - offset);
}

function isWeekday(date: Date): boolean {
    const weekday = getParts(date).weekday;
    return weekday !== "Sat" && weekday !== "Sun";
}

export function getUsMarketSessionInfo(now = new Date()): MarketSessionInfo {
    const parts = getParts(now);

    const year = Number(parts.year);
    const month = Number(parts.month);
    const day = Number(parts.day);

    const todayOpen = zonedTimeToUtc(year, month, day, 9, 30);
    const todayClose = zonedTimeToUtc(year, month, day, 16, 0);

    if (isWeekday(now) && now >= todayOpen && now < todayClose) {
        return {
            isOpen: true,
            nextOpenAt: null,
            nextCloseAt: todayClose,
        };
    }

    for (let i = 0; i < 10; i++) {
        const candidateBase = new Date(Date.UTC(year, month - 1, day + i, 12));
        const candidateParts = getParts(candidateBase);

        const candidateOpen = zonedTimeToUtc(
            Number(candidateParts.year),
            Number(candidateParts.month),
            Number(candidateParts.day),
            9,
            30
        );

        if (candidateOpen > now && isWeekday(candidateOpen)) {
            return {
                isOpen: false,
                nextOpenAt: candidateOpen,
                nextCloseAt: null,
            };
        }
    }

    return {
        isOpen: false,
        nextOpenAt: null,
        nextCloseAt: null
    };
}
export function formatCountdown(target: Date | null): string {
    if (target === null) {
        return "--:--:--";
    }

    const diffMs = target.getTime() - Date.now();

    if (diffMs <= 0) {
        return "00:00:00";
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}