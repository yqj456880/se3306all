const BASE_URL = "";
const USE_MOCK = BASE_URL === "";
import { mockRequest } from "./mock";

export async function request(path, options = {}) {
  if (USE_MOCK) {
    const mockBody = await mockRequest(path, options);
    if (mockBody.code !== 0) throw new Error(mockBody.message);
    return mockBody.data;
  }
  const res = await fetch(BASE_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json();
  if (body.code !== 0) throw new Error(body.message);
  return body.data;
}

export const http = {
  get: (p) => request(p),
  post: (p, d) => request(p, { method: "POST", body: JSON.stringify(d) }),
  put: (p, d) => request(p, { method: "PUT", body: JSON.stringify(d) }),
  del: (p) => request(p, { method: "DELETE" }),
};
