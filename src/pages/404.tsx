import React from "react";
import CustomError from "~/components/CustomError";

function errorPage() {
  return (
    <CustomError href="/" backToWhere="home page" pageName="page, error 404" />
  );
}

export default errorPage;
