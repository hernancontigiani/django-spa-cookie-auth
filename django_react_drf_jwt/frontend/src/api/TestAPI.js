import { client } from "./client"
import { getAuthHeader } from "./AuthAPI"

export const TestAPI = {
  whoami: async function () {
    const response = await client.request({
      url: `/api/whoami/`,
      // headers: {
      //   "Content-Type": "application/json",
      //   "Authorization": getAuthHeader(),
      // },
      method: "GET",
    })
    if(response) {
      return response.data
    }
  },

}