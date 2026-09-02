import { useEffect, useState } from 'react';

import { useIsPBMode } from '@ibexa/react-headless';

interface ReceivedMessage {
    id: number;
    origin: string;
    type: string;
}

const readType = (data: unknown): string =>
    typeof data === 'object' && data !== null && 'type' in data && typeof data.type === 'string' ? data.type : '(bez typu)';

export const PbDiagnostics = ({ origin }: { origin: string | undefined }) => {
    const isPBMode = useIsPBMode();
    const [messages, setMessages] = useState<ReceivedMessage[]>([]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            setMessages((current) => [...current, { id: current.length, origin: event.origin, type: readType(event.data) }]);
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <aside className="pb-diagnostics">
            <p>
                <strong>oczekiwany origin:</strong> {origin ?? '(nie ustawiony)'}
            </p>
            <p>
                <strong>tryb PB:</strong> {isPBMode ? 'aktywny' : 'nieaktywny — brak PB:INIT_MODE'}
            </p>
            <p>
                <strong>odebrane wiadomości:</strong> {messages.length === 0 ? 'żadnych' : ''}
            </p>
            <ol>
                {messages.map((message) => (
                    <li key={message.id}>
                        <code>{message.type}</code> z <code>{message.origin}</code>
                    </li>
                ))}
            </ol>
        </aside>
    );
};
