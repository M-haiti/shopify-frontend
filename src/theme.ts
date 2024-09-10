import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode, GlobalStyleProps } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        bg: mode('#222', '#333')(props),
        color: mode('whiteAlpha.900', 'whiteAlpha.900')(props),
      },
    }),
  },
});

export default theme;
