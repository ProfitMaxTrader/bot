// src/pages/verify.tsx
import { useEffect } from 'react';

const VerifyPage = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const entries = Object.fromEntries(urlParams.entries());
        console.log('✅ Logged in via OAuth:', entries);
    }, []);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>✅ You are now logged in with Deriv!</h1>
            <p>Check the browser console for token details.</p>
        </div>
    );
};

export default VerifyPage;
