import axios from "axios";

// const baseURL = "https://api.studio.thegraph.com/query/7076/gamefi/v0.0.7";
// test
// const baseURL =
//   "https://subgraph-test.icarus.finance/subgraphs/name/ica/gamefi-subgraph-test";

//prod
// const baseURL = 'https://subgraph-test.icarus.finance/subgraphs/name/ica/gamefi-mainnet'

const baseURL = "https://nft-api.icarus.finance";

const getBlindBox = async (owner) => {
  if (!owner) {
    return;
  }
  const result = await axios.get(`${baseURL}/api/box`, {
    params: {
      owner,
      pageSize: 1000,
    },
    // query: `{
    //       blindBoxes(orderBy: createdAt, orderByDirection: asc, where:{owner: "${owner.toLowerCase()}"} ){
    //         id
    //         staked
    //         value
    //         capsule
    //         state
    //         createdAt
    //         endAt
    //         medias
    //       }
    //     }`,
  });
  console.log("result", result);
  result.data.data.forEach((item) => {
    item.createdAt = item.createdAtTimestamp * 1000;
    item.endAt = item.endAtTimestamp * 1000;
    // item.isOld = item.createdAt < 1635901200000
  });
  return result.data.data;
};

const getCollection = async (owner) => {
  if (!owner) {
    return;
  }
  const result = await axios.get(`${baseURL}/api/media`, {
    params: {
      owner,
      pageSize: 1000,
    },
    // query: `{
    //   medias(first: 1000, where:{owner: "${owner.toLowerCase()}"}) {
    //     id,
    //     contentURI,
    //   }
    // }`,
  });

  let medias = result.data.data;

  for (let i = 0; i < medias.length; i++) {
    let externalInfo = (await axios.get(medias[i].contentURI)).data;

    if (!externalInfo) {
      continue;
    }
    externalInfo.dropRate = (
      Number(externalInfo.attributes[0].drop_rate) / 100
    ).toFixed(2);
    externalInfo.contentURI = externalInfo.animation_url;
    medias[i] = {
      ...medias[i],
      ...externalInfo,
    };
  }

  // for (let i = 0; i < medias.length; i++) {
  //   let externalInfo = await getContentURI(medias[i].id);
  //   if(!externalInfo){
  //     continue
  //   }
  //   externalInfo.dropRate = (Number(externalInfo.attributes[0].drop_rate) / 100).toFixed(2)
  //   externalInfo.contentURI = externalInfo.animation_url
  //   medias[i] = {
  //     ...medias[i],
  //     ...externalInfo
  //   }
  // }

  return medias;
};

const getContentURI = async (tokenId) => {
  const result = await axios.get(`${baseURL}/api/media`, {
    params: {
      id: tokenId,
    },
  });

  const contentURI = result.data.data[0].contentURI;

  try {
    const res = (await axios.get(contentURI)).data;
    console.log(res, "content uri response");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export default {
  getBlindBox,
  getCollection,
  getContentURI,
};
