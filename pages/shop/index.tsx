import { useEffect } from "react";

// next
import Head from "next/head";

// @mui
import { Container } from "@mui/material";

// components

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
        <ShopProductList products={products} loading={!products.length} />
      </Container>
    </>
  );
}
