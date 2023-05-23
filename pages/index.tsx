import { m } from "framer-motion";
import React from "react";
import { textGradient } from "../src/utils/cssStyles";
import { Typography, styled } from "@mui/material";
import { varFade } from "../src/components/animate";

const StyledGradientText = styled(m.h1)({
  ...textGradient(
    `300deg, #3437a5 0%, #488dee 25%, #3437a5 50%, #488dee 75%, #3437a5 100%`
  ),
  backgroundSize: "400%",
  fontFamily: "'Daniel', sans-serif",
  fontSize: `${64 / 16}rem`,
  textAlign: "center",
  "@media(min-width:900px)": {
    fontSize: `${96 / 16}rem`,
  },
  margin: 0,
});

export default function HomePage() {
  return (
    <div className="outer">
      <div className="wrap">
        <div className="content">
          <m.div variants={varFade().in}>
            <StyledGradientText
              animate={{ backgroundPosition: "200% center" }}
              transition={{
                repeatType: "reverse",
                ease: "linear",
                duration: 20,
                repeat: Infinity,
              }}
            >
              Stariva
            </StyledGradientText>
          </m.div>
          <Typography variant="body1" sx={{ color: "rgb(145, 158, 171)" }}>
            info@stariva.shop
          </Typography>
        </div>
      </div>
    </div>
  );
}
