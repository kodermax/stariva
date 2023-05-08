import { m } from "framer-motion";
import React from "react";
import { textGradient } from "../src/utils/cssStyles";
import { styled } from "@mui/material";
import { varFade } from "../src/components/animate";

const StyledGradientText = styled(m.h1)({
  ...textGradient(
    `300deg, #00AB55 0%, #FFAB00 25%, #00AB55 50%, #FFAB00 75%, #00AB55 100%`
  ),
  backgroundSize: "400%",
  fontFamily: "'Daniel', sans-serif",
  fontSize: `${64 / 16}rem`,
  textAlign: "center",
  lineHeight: 1,
  padding: 0,
  marginTop: 8,
  marginBottom: 24,
  letterSpacing: 8,
  "@media(min-width:900px)": {
    fontSize: `${96 / 16}rem`,
  },
});

function HomePage() {
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
        </div>
      </div>
    </div>
  );
}
export default HomePage;
