import { m } from "framer-motion";
import React from "react";
import { textGradient } from "../src/utils/cssStyles";
import styled from "@emotion/styled";

const StyledGradientText = styled(m.h1)(() => ({
  ...textGradient(
    `300deg, #00AB55 0%, #FFAB00 25%, #00AB55 50%, #FFAB00 75%, #00AB55 100%`
  ),
  backgroundSize: "400%",
  fontFamily: "'Barlow', sans-serif",
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
}));

function HomePage() {
  return (
    <div className="outer">
      <div className="wrap">
        <div className="content">
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
        </div>
      </div>
    </div>
  );
}
export default HomePage;
