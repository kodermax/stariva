import { forwardRef } from 'react';
import { m } from 'framer-motion';

// next
import NextLink from 'next/link';

// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, BoxProps } from '@mui/material';
import { textGradient } from '../../utils/cssStyles';
import { varFade } from '../animate';

// ----------------------------------------------------------------------
const StyledGradientText = styled(m.h1)({
  ...textGradient(
    `300deg, #3437a5 0%, #488dee 25%, #3437a5 50%, #488dee 75%, #3437a5 100%`
  ),
  backgroundSize: '400%',
  fontFamily: "'Daniel', sans-serif",
  fontSize: `${24 / 16}rem`,
  textAlign: 'center',
  '@media(min-width:900px)': {
    fontSize: `${24 / 16}rem`,
  },
  margin: 0,
});

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
      <Box
        ref={ref}
        component='div'
        sx={{
          width: 40,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <m.div variants={varFade().in}>
          <StyledGradientText
            animate={{ backgroundPosition: '200% center' }}
            transition={{
              repeatType: 'reverse',
              ease: 'linear',
              duration: 20,
              repeat: Infinity,
            }}
          >
            Stariva
          </StyledGradientText>
        </m.div>
      </Box>
    );

    if (disabledLink) {
      return <>{logo}</>;
    }

    return (
      <NextLink href='/' passHref>
        <Link sx={{ display: 'contents' }}>{logo}</Link>
      </NextLink>
    );
  }
);

export default Logo;
