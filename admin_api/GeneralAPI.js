
function getUrl(BASE_URL, suffix) {
    console.log("url is "+ BASE_URL+ "..." +suffix)
  return BASE_URL + suffix;
}
const GeneralAPI = (BASE_URL, API_TYPE)=> {
    return {
        ["create_" + API_TYPE]:  {
            getConfigParams: (params) => {
            return {
                data: params, //JSON.stringify(data),
            };
            },
            getUrl: () => getUrl(BASE_URL, "/create"),
            apiType: API_TYPE,
            method: "post",
        }
    }
}

export default GeneralAPI;
