import { useEffect } from 'react';

const Verify = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokens: string[] = [];

        // Collect tokens (supporting multiple accounts)
        for (let i = 1; i <= 3; i++) {
            const token = urlParams.get(`token${i}`);
            if (token) tokens.push(token);
        }

        if (tokens.length > 0) {
            // Save the first token to localStorage (or wherever you manage auth)
            localStorage.setItem('auth_token', tokens[0]);
            // Redirect to dashboard or homepage
            window.location.href = '/';
        } else {
            console.error('No tokens found in URL');
        }
    }, []);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Processing login...</h2>
        </div>
    );
};

export default Verify;
