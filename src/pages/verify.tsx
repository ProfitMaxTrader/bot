import { useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
            console.error('No code found in URL');
            return;
        }

        const ws = new WebSocket('wss://ws.derivws.com/websockets/v3');

        ws.onopen = () => {
            ws.send(JSON.stringify({ authorize: code }));
        };

        ws.onmessage = msg => {
            const data = JSON.parse(msg.data);

            if (data.error) {
                console.error('Authorization error:', data.error);
            } else if (data.msg_type === 'authorize') {
                // Save token and reload or redirect
                localStorage.setItem('auth_token', data.echo_req.authorize);
                navigate('/', { replace: true }); // or /dashboard
            }

            ws.close();
        };
    }, [location, navigate]);

    return <div>Verifying your login, please wait...</div>;
};

export default Verify;
