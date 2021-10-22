import axios from "axios";

// const baseURL = "https://api.studio.thegraph.com/query/7076/gamefi/v0.0.7";
const baseURL = "https://subgraph-test.icarus.finance/subgraphs/name/ica/gamefi-subgraph-test";

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
        id,
        contentURI,
      }
    }`,
  });

  return result.data.data.medias;
};

const getContentURI = async (tokenId) => {
  console.log('token id is', tokenId)
  const result = await axios.post(baseURL, {
    query: `{
      medias(where:{id: "${tokenId}"}) {
        id,
        contentURI
      }
    }`,
  });
  console.log('resu', result)
  if(result.data.data.medias && result.data.data.medias.length > 0 && result.data.data.medias[0].contentURI.indexOf('ipfs.io') > -1){
    const jsonURI = result.data.data.medias[0].contentURI
    try{
      const res = await axios.get(jsonURI)
      return res.data
    }catch(err){
      console.log(err)
    }
  }else{
    return null;
  }
};

export default {
  getBlindBox,
  getCollection,
  getContentURI
};
