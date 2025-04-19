import React from 'react';
import { useAuthData } from '@deriv-com/api-hooks';

const Header = () => {
    const { isAuthorized, logout } = useAuthData();

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                color: '#0f172a',
                fontSize: '16px',
            }}
        >
            {/* Left: Logo + Divider + Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src='/assets/logo.png' alt='ProfitMax Logo' style={{ height: '56px', objectFit: 'contain' }} />
                {/* Vertical Divider */}
                <div style={{ height: '32px', width: '1px', backgroundColor: '#ccc' }} />
                <a
                    href='https://t.me/ProfitMaxTraderHub'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                        backgroundColor: '#0088cc',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                    }}
                >
                    Telegram
                </a>
                <a
                    href='https://dm-pay.africa/'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                    }}
                >
                    deposit/withdraw
                </a>
            </div>

            {/* Center: Powered by Deriv */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <img
                    src='/assets/poweredbyderiv.png'
                    alt='Powered by Deriv'
                    style={{ height: '40px', objectFit: 'contain' }}
                />
            </div>

            {/* Right: Login/Signup or Logout */}
            <div style={{ display: 'flex', gap: '14px' }}>
                {!isAuthorized ? (
                    <>
                        <a
                            href='https://oauth.deriv.com/oauth2/authorize?app_id=70082&scope=read,trade,trading_information&redirect_uri=https://bots.profitmaxtrader.com/verify'
                            style={{
                                border: '2px solid #ff444f',
                                color: '#ff444f',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: '700',
                                fontSize: '15px',
                            }}
                        >
                            Login
                        </a>
                        <a
                            href='https://track.deriv.com/_71lZpQSowCcKqFKZ7JdnQ2Nd7ZgqdRLk/1/'
                            style={{
                                border: '2px solid #ff444f',
                                color: '#ff444f',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: '700',
                                fontSize: '15px',
                            }}
                        >
                            Sign Up
                        </a>
                    </>
                ) : (
                    <button
                        onClick={logout}
                        style={{
                            border: '2px solid #ff444f',
                            backgroundColor: '#ff444f',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '15px',
                            cursor: 'pointer',
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
