import { useEffect } from "react";

// next
import Head from "next/head";

// @mui
import { Container, Stack } from "@mui/material";

// components

import ShopProductSearch from "../../src/sections/shop/ShopProductSearch";
import ShopProductList from "../../src/sections/shop/ShopProductList";
import { useDispatch, useSelector } from "../../src/redux/store";
import { getProducts } from "../../src/redux/slices/product";
import SimpleLayout from "../../src/layouts/simple/SimpleLayout";

// ----------------------------------------------------------------------

ShopPage.getLayout = (page: React.ReactElement) => (
  <SimpleLayout>{page}</SimpleLayout>
);

// ----------------------------------------------------------------------

export default function ShopPage() {
  const dispatch = useDispatch();

  const { products } = useSelector((state: any) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title> Магазин | Stariva</title>
      </Head>

      <Container maxWidth={"lg"}>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <ShopProductSearch />
        </Stack>

        <ShopProductList products={products} loading={!products.length} />
      </Container>
    </>
  );
}
