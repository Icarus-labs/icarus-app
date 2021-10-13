import axios from "axios";
import { coingeckoURL } from "config";

export async function getTokenPrice(id) {
  return new Promise(async (resolve) => {
    const res = await axios.get(`${coingeckoURL}/simple/price`, {
      params: {
        ids: id,
        vs_currencies: "usd",
      },
    });
    resolve(res?.data[id]?.usd);
  });
}
