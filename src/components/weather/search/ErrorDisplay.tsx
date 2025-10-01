'use client';

import ErrorAlert from '../ui/ErrorAlert';

type Props = {
    error: string;
    onClearError: () => void;
};

export function ErrorDisplay({ error, onClearError }: Props) {
    if (!error) return null;

    return (
        <ErrorAlert
            message={error}
            type="error"
            onClose={onClearError}
            autoClose={true}
            duration={3000}
        />
    );
}
