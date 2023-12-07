import axios from "axios";

export const NextApiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    Accept: "application/json",
  },
});
