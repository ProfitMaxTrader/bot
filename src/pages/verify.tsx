import { useEffect } from 'react';

const Verify = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token1');

        if (token) {
            // Save to localStorage for global access
            localStorage.setItem('auth_token', token);

            // Connect to Deriv WebSocket and send authorize call
            const socket = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=70082');

            socket.onopen = () => {
                socket.send(JSON.stringify({ authorize: token }));
            };

            socket.onmessage = event => {
                const data = JSON.parse(event.data);
                if (data.msg_type === 'authorize') {
                    console.log('✅ Logged in as:', data.authorize.loginid);
                    // Redirect to homepage
                    window.location.href = '/';
                } else if (data.error) {
                    console.error('❌ Authorization error:', data.error.message);
                }
            };

            socket.onerror = err => {
                console.error('❌ WebSocket error:', err);
            };
        } else {
            console.error('❌ No token found in URL');
        }
    }, []);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>🔄 Logging you in...</h2>
        </div>
    );
};

export default Verify;
