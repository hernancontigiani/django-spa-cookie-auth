import { client } from "./client"
import { getAuthHeader } from "./AuthAPI"

export const TestAPI = {
  whoami: async function () {
    const response = await client.request({
      url: `/api/whoami/`,
      method: "GET",
    })
    if(response) {
      return response.data
    }
  },

}