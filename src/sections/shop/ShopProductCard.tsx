import { paramCase } from 'change-case';

// @mui
import { Box, Button, Card, Stack } from '@mui/material';

// routes

import { IProduct } from '../../@types/product';
import { fCurrency } from '../../utils/formatNumber';
import Label from '../../components/label';
import Image from '../../components/image';
import { ColorPreview } from '../../components/color-utils';
import Link from '../../components/link/Link';

// ----------------------------------------------------------------------

type Props = {
  product: IProduct;
};

export default function ShopProductCard({ product }: Props) {
  const { name, cover, price, colors, status, priceSale } = product;

  const linkTo = `${paramCase(name)}`;

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 1 }}>
        {status && (
          <Label
            variant='filled'
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <Image alt={name} src={cover} ratio='1/1' sx={{ borderRadius: 1.5 }} />
      </Box>

      <Stack spacing={2.5} sx={{ p: 3 }}>
        <Button color='inherit' noWrap component={Link} href={linkTo}>
          {name}
        </Button>

        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <ColorPreview colors={colors} />

          <Stack direction='row' spacing={0.5} sx={{ typography: 'subtitle1' }}>
            {priceSale && (
              <Box
                component='span'
                sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
              >
                {fCurrency(priceSale)}
              </Box>
            )}

            <Box component='span'>{fCurrency(price)}</Box>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
