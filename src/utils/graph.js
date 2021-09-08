import axios from "axios";

// const baseURL = "https://api.studio.thegraph.com/query/7076/gamefi/v0.0.6";
const baseURL = "https://subgraph-test.icarus.finance/subgraphs/name/ica/gamefi-subgraph";

const getBlindBox = async (owner) => {
  if(!owner){
    return
  }
  const result = await axios.post(baseURL, {
    query: `{
          blindBoxes(orderBy: createdAt, orderByDirection: asc, where:{owner: "${owner.toLowerCase()}"} ){
            id
            staked
            value
            capsule
            state
            createdAt
            endAt
            medias
          }
        }`,
  });
  result.data.data.blindBoxes.forEach((item) => {
    item.createdAt = item.createdAt * 1000;
    item.endAt = item.endAt * 1000;
  });
  return result.data.data.blindBoxes;
};

const getCollection = async (owner) => {
  if(!owner){
    return
  }
  const result = await axios.post(baseURL, {
    query: `{
      medias(where:{owner: "${owner.toLowerCase()}"}) {
        id
      }
    }`,
  });

  // console.log("result", result.data);

  return result.data.data.medias;
};

export default {
  getBlindBox,
  getCollection,
};
