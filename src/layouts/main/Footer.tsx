// @mui
import { Box, Link, Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component='footer'
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Typography variant='caption' component='div'>
          © All rights reserved
          <Link href='info@stariva.shop'> info@stariva.shop </Link>
        </Typography>
      </Container>
    </Box>
  );
}
