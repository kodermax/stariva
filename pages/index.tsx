import React from 'react';
import { Typography } from '@mui/material';

export default function HomePage() {
  return (
    <div className='outer'>
      <div className='wrap'>
        <div className='content'>
          <Typography variant='body1' sx={{ color: 'rgb(145, 158, 171)' }}>
            info@stariva.shop
          </Typography>
        </div>
      </div>
    </div>
  );
}
