import type { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse, RequestOptions } from "node-mocks-http";

export const mockRequestResponse = (
  options: RequestOptions = { method: "GET" }
) => {
  const req = createRequest<NextApiRequest>(options);
  const res = createResponse<NextApiResponse>();
  req.headers = { "Content-Type": "application/json" };
  return { req, res };
};
