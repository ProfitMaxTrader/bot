import { localize } from '@/utils/tmp/dummy';

export type TSidebarItem = {
    label: string;
    content: { data: string; faq_id?: string }[];
    link: boolean;
};

export const SIDEBAR_INTRO: TSidebarItem[] = [
    {
        label: localize('Welcome to ProfitMax Trader'),
        content: [
            {
                data: localize('Your smart trading edge on Deriv — automate, analyze, and win.'),
            },
        ],
        link: false,
    },
    {
        label: localize('Guide'),
        content: [{ data: localize('Deriv Bot - your automated trading partner') }],
        link: true,
    },
    {
        label: localize('FAQs'),
        content: [
            {
                data: localize('What is Deriv Bot?'),
                faq_id: 'faq-0',
            },
            {
                data: localize('Where do I find the blocks I need?'),
                faq_id: 'faq-1',
            },
            {
                data: localize('How do I remove blocks from the workspace?'),
                faq_id: 'faq-2',
            },
        ],
        link: true,
    },
];
