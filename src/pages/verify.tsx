import { useEffect } from 'react';

const Verify = () => {
    useEffect(() => {
        console.log('✅ /verify page loaded.');
        console.log('🔍 Current URL:', window.location.href);

        const urlParams = new URLSearchParams(window.location.search);
        const tokens: string[] = [];

        // Collect tokens (supporting multiple accounts)
        for (let i = 1; i <= 3; i++) {
            const token = urlParams.get(`token${i}`);
            if (token) {
                console.log(`✅ Found token${i}:`, token);
                tokens.push(token);
            }
        }

        if (tokens.length > 0) {
            // Save the first token to localStorage
            localStorage.setItem('auth_token', tokens[0]);
            console.log('💾 Stored auth_token in localStorage.');
            // Redirect to homepage where the auth hook can pick it up
            window.location.href = '/';
        } else {
            console.error('❌ No tokens found in URL.');
        }
    }, []);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>🔄 Processing login...</h2>
            <p>Check console logs for token status.</p>
        </div>
    );
};

export default Verify;
