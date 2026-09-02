import { useEffect, useState } from 'react';

import { useIsPBMode } from '@ibexa/react-headless';

interface ReceivedMessage {
    id: number;
    origin: string;
    type: string;
}

const readType = (data: unknown): string =>
    typeof data === 'object' && data !== null && 'type' in data && typeof data.type === 'string' ? data.type : '(bez typu)';

const readParentOrigin = (): string => {
    const ancestor = Array.from(window.location.ancestorOrigins).at(0);

    if (ancestor) {
        return ancestor;
    }

    return window.document.referrer ? new URL(window.document.referrer).origin : '(nieznany)';
};

export const PbDiagnostics = ({ origin }: { origin: string | undefined }) => {
    const isPBMode = useIsPBMode();
    const [messages, setMessages] = useState<ReceivedMessage[]>([]);
    const [parentOrigin, setParentOrigin] = useState('(sprawdzanie)');

    useEffect(() => {
        setParentOrigin(readParentOrigin());
    }, []);

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
                <strong>origin rodzica:</strong> {parentOrigin}
            </p>
            <p>
                <strong>zgodność:</strong> {origin === parentOrigin ? 'tak' : 'NIE — postMessage jest blokowany'}
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
