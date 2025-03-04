import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import { api_base } from '@/external/bot-skeleton';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { useDevice } from '@deriv-com/ui';
import { crypto_currencies_display_order, fiat_currencies_display_order } from '../shared';
import Footer from './footer';
import AppHeader from './header';
import Body from './main-body';
import './layout.scss';

const Layout = () => {
    const { isDesktop } = useDevice();

    const { isOAuth2Enabled } = useOauth2();

    const isCallbackPage = window.location.pathname === '/callback';
    const isLoggedInCookie = Cookies.get('logged_state') === 'true';
    const isEndpointPage = window.location.pathname.includes('endpoint');
    const checkClientAccount = JSON.parse(localStorage.getItem('clientAccounts') ?? '{}');
    const getQueryParams = new URLSearchParams(window.location.search);
    const currency = getQueryParams.get('account') ?? '';
    const accountsList = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
    const isClientAccountsPopulated = Object.keys(accountsList).length > 0;
    const ifClientAccountHasCurrency =
        Object.values(checkClientAccount).some(account => account.currency === currency) ||
        currency === 'demo' ||
        currency === '';
    const [clientHasCurrency, setClientHasCurrency] = useState(ifClientAccountHasCurrency);

    const validCurrencies = [...fiat_currencies_display_order, ...crypto_currencies_display_order];
    const query_currency = (getQueryParams.get('account') ?? '')?.toUpperCase();
    const isCurrencyValid = validCurrencies.includes(query_currency);
    const api_accounts = [];
    let subscription: { unsubscribe: () => void };

    const validateApiAccounts = ({ data }: any) => {
        if (data.msg_type === 'authorize') {
            api_accounts.push(data.authorize.account_list || []);
            const allCurrencies = new Set(Object.values(checkClientAccount).map(acc => acc.currency));
            let currency = 'USD';
            const hasMissingCurrency = api_accounts?.flat().some(data => {
                if (!allCurrencies.has(data.currency)) {
                    sessionStorage.setItem('query_param_currency', currency);
                    return true;
                }
                currency = data.currency;
                return false;
            });

            if (hasMissingCurrency) {
                setClientHasCurrency(false);
            } else {
                sessionStorage.removeItem('query_param_currency');
                setClientHasCurrency(true);
            }

            if (subscription) {
                subscription?.unsubscribe();
            }
        }
    };

    useEffect(() => {
        if (isCurrencyValid && api_base.api) {
            // Subscribe to the onMessage event
            subscription = api_base.api.onMessage().subscribe(validateApiAccounts);
        }
    }, []);

    useEffect(() => {
        if (
            (isLoggedInCookie && !isClientAccountsPopulated && isOAuth2Enabled && !isEndpointPage && !isCallbackPage) ||
            !clientHasCurrency
        ) {
            const query_param_currency = sessionStorage.getItem('query_param_currency') || currency || 'USD';
            sessionStorage.setItem('query_param_currency', currency);
            requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
                ...(query_param_currency
                    ? {
                          state: {
                              account: query_param_currency,
                          },
                      }
                    : {}),
            });
        }
    }, [
        isLoggedInCookie,
        isClientAccountsPopulated,
        isOAuth2Enabled,
        isEndpointPage,
        isCallbackPage,
        clientHasCurrency,
    ]);

    return (
        <div className={clsx('layout', { responsive: isDesktop })}>
            {!isCallbackPage && <AppHeader />}
            <Body>
                <Outlet />
            </Body>
            {!isCallbackPage && isDesktop && <Footer />}
        </div>
    );
};

export default Layout;
