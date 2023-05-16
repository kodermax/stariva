import React from "react";
import Router from "next/router";

// Track client-side page views with Segment
Router.events.on("routeChangeComplete", (url) => {
  (window as any).analytics.page(url);
});

const Page = ({ children }: any) => <div>{children}</div>;

export default Page;
