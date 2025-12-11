'use client';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { ReactNode } from 'react';
import createEmotionCache from '@/lib/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme({
  palette: {
    primary: { main: '#1e88e5' },
    secondary: { main: '#1565c0' },
    background: { default: '#f5f7fa' },
    text: { primary: '#2c3e50' },
  },
});

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
