import React from "react";

const ErrorText = (props: React.PropsWithChildren) => {
  return <p className="text-red-500">{props.children}</p>;
};

export default ErrorText;
