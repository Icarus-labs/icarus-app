import axios from "axios";

// const baseURL = "https://api.studio.thegraph.com/query/7076/gamefi/v0.0.7";
const baseURL =
  "https://subgraph-test.icarus.finance/subgraphs/name/ica/gamefi-subgraph-test";

const getBlindBox = async (owner) => {
  if (!owner) {
    return;
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
  if (!owner) {
    return;
  }
  const result = await axios.post(baseURL, {
    query: `{
      medias(where:{owner: "${owner.toLowerCase()}"}) {
        id,
        contentURI,
      }
    }`,
  });

  let medias = result.data.data.medias

  for (let i = 0; i < medias.length; i++) {
    let externalInfo = await getContentURI(medias[i].id);
    if(!externalInfo){
      continue
    }
    externalInfo.dropRate = (Number(externalInfo.attributes[0].drop_rate) / 100).toFixed(2)
    externalInfo.contentURI = externalInfo.animation_url
    medias[i] = {
      ...medias[i],
      ...externalInfo
    }
  }

  return medias;
};

const getContentURI = async (tokenId) => {
  const result = await axios.post(baseURL, {
    query: `{
      medias(where:{id: "${tokenId}"}) {
        id,
        contentURI
      }
    }`,
  });
  if (
    result.data.data.medias &&
    result.data.data.medias.length > 0 &&
    result.data.data.medias[0].contentURI.indexOf("ipfs.io") > -1
  ) {
    const jsonURI = result.data.data.medias[0].contentURI;
    try {
      const res = await axios.get(jsonURI);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  } else {
    return null;
  }
};

export default {
  getBlindBox,
  getCollection,
  getContentURI,
};
