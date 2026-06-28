
type HeaderProps = {
    connected: boolean;
}

export function Header({ connected }: HeaderProps) {
    return (
        <header className="header">
            <h1>💹 Live Market Dashboard</h1>
            <div className={connected ? "status connected" : "status disconnected"} >
                ● {connected?"Connected":"Disconnected"}</div>
        </header >
    );
}