// @mui
import { Box, BoxProps } from "@mui/material";

//
import ShopProductCard from "./ShopProductCard";
import { IProduct } from "../../@types/product";
import SkeletonProductItem from "../../skeleton/SkeletonProductItem";

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  products: IProduct[];
  loading: boolean;
}

export default function ShopProductList({
  products,
  loading,
  ...other
}: Props) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      {...other}
    >
      {(loading ? [...Array(12)] : products).map((product, index) =>
        product ? (
          <ShopProductCard key={product.id} product={product} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )}
    </Box>
  );
}
