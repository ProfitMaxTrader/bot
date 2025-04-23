import { initSurvicate } from '../public-path';
import { lazy, Suspense } from 'react';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import { crypto_currencies_display_order, fiat_currencies_display_order } from '@/components/shared';
import { StoreProvider } from '@/hooks/useStore';
import CallbackPage from '@/pages/callback';
import Endpoint from '@/pages/endpoint';
import { TAuthData } from '@/types/api-types';
import { initializeI18n, localize, TranslationProvider } from '@deriv-com/translations';
import CoreStoreProvider from './CoreStoreProvider';
import './app-root.scss';

const Layout = lazy(() => import('../components/layout'));
const AppRoot = lazy(() => import('./app-root'));

// App details from your environment
const { TRANSLATIONS_CDN_URL, R2_PROJECT_NAME, CROWDIN_BRANCH_NAME } = process.env;

const cdnUrl =
    TRANSLATIONS_CDN_URL && R2_PROJECT_NAME && CROWDIN_BRANCH_NAME
        ? `${TRANSLATIONS_CDN_URL}/${R2_PROJECT_NAME}/${CROWDIN_BRANCH_NAME}`
        : 'https://cdn.deriv.com/translations/deriv-app/master'; // fallback

const i18nInstance = initializeI18n({
    cdnUrl,
});

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path='/'
            element={
                <Suspense
                    fallback={<ChunkLoader message={localize('Please wait while we connect to the server...')} />}
                >
                    <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                        <StoreProvider>
                            <RoutePromptDialog />
                            <CoreStoreProvider>
                                <Layout />
                            </CoreStoreProvider>
                        </StoreProvider>
                    </TranslationProvider>
                </Suspense>
            }
        >
            <Route index element={<AppRoot />} />
            <Route path='endpoint' element={<Endpoint />} />
            <Route path='callback' element={<CallbackPage />} />
        </Route>
    )
);

function App() {
    React.useEffect(() => {
        initSurvicate();
        window?.dataLayer?.push({ event: 'page_load' });

        return () => {
            const survicate_box = document.getElementById('survicate-box');
            if (survicate_box) {
                survicate_box.style.display = 'none';
            }
        };
    }, []);

    React.useEffect(() => {
        const url_params = new URLSearchParams(window.location.search);
        const token1 = url_params.get('token1');
        const acct1 = url_params.get('acct1');
        const token2 = url_params.get('token2');
        const acct2 = url_params.get('acct2');

        const active_token = token1 || token2;
        const active_loginid = acct1 || acct2;

        if (active_token && active_loginid) {
            localStorage.setItem('authToken', active_token);
            localStorage.setItem('active_loginid', active_loginid);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const accounts_list = localStorage.getItem('accountsList');
        const client_accounts = localStorage.getItem('clientAccounts');

        if (!accounts_list || !client_accounts) return;

        try {
            const parsed_accounts = JSON.parse(accounts_list);
            const parsed_client_accounts = JSON.parse(client_accounts) as TAuthData['account_list'];

            const updateLocalStorage = (token: string, loginid: string) => {
                localStorage.setItem('authToken', token);
                localStorage.setItem('active_loginid', loginid);
            };

            if (acct1?.toUpperCase() === 'DEMO') {
                const demo_account = Object.entries(parsed_accounts).find(([key]) => key.startsWith('VR'));
                if (demo_account) {
                    const [loginid, token] = demo_account;
                    updateLocalStorage(String(token), loginid);
                    return;
                }
            }

            if (acct1?.toUpperCase() !== 'DEMO' && token1) {
                const real_account = Object.entries(parsed_client_accounts).find(
                    ([loginid, account]) =>
                        !loginid.startsWith('VR') && account.currency.toUpperCase() === acct1?.toUpperCase()
                );
                if (real_account) {
                    const [loginid, account] = real_account;
                    if ('token' in account) {
                        updateLocalStorage(String(account?.token), loginid);
                    }
                    return;
                }
            }
        } catch (e) {
            console.warn('Error', e);
        }
    }, []);

    React.useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const app_id = process.env.REACT_APP_DERIV_APP_ID || '71895';
            const wsUrl = `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}&token=${token}`;
            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                console.log('WebSocket connection established.');
                socket.send(
                    JSON.stringify({
                        msg_type: 'authorize',
                        authorize: {
                            token,
                        },
                    })
                );
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Received data:', data);
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socket.onclose = (event) => {
                if (event.wasClean) {
                    console.log('Closed cleanly');
                } else {
                    console.error('Closed unexpectedly');
                }
            };
        }
    }, []);

    return <RouterProvider router={router} />;
}

export default App;
