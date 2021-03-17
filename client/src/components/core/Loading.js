import React from "react";
import { css } from "@emotion/core";
import RingLoader from "react-spinners/RingLoader";

const override = css`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
`;

const Loading = () => {
  return <RingLoader css={override} size={150} color={"red"} loading={true} />;
};

export default Loading;
