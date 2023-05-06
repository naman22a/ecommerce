import React from 'react';
import { Header, Cart } from '@/components';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'dark',
                    primaryColor: 'teal'
                }}
            >
                <Notifications
                    position="top-center"
                    zIndex={2077}
                    limit={2}
                    autoClose={1500}
                />
                <Header />
                {children}
                <Cart />
            </MantineProvider>
        </>
    );
};

export default Layout;
