
type StatsPanelProps={
    title:string;
};

export function StatsPanel({title}:StatsPanelProps) {
    return (
        <section className="panel">
            <h2>{title}</h2>
        </section>
    );
}