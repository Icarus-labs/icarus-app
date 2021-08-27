import axios from "axios";

const baseURL = "https://api.studio.thegraph.com/query/7076/gamefi/v0.0.2";

const getBlindBox = async () => {
  const result = await axios.post(baseURL, {
    query: `{
          blindBoxes(orderBy: timestamp, orderByDirection: asc){
            id
            value
            to
            timestamp
          }
        }`,
  });
  result.data.data.blindBoxes.forEach(item => {
    item.timestamp = item.timestamp * 1000
    item.endtime = item.timestamp + 30 * 24 * 60 * 60 * 1000
  })
  return result.data.data.blindBoxes;
};

export default {
  getBlindBox,
};
