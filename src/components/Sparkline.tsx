type SparklineProps = {
    values: number[];
    trend: "up" | "down" | "flat";
};

export function Sparkline({ values, trend }: SparklineProps) {
    const width = 88;
    const height = 28;

    if (values.length < 2) {
        return <svg width={width} height={height} />;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = height - ((value - min) / range) * height;

            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg className={`sparkline sparkline-${trend}`}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}>
            <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}