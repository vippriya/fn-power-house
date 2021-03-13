

const config = {
	timeout: 10000,
	headers: {
		'Access-Control-Allow-Origin': '*'
	}
};
const platformRef =  axios.create(config);



const APIMap = {
    ...ProductAPI,
    ...ApplicationReferenceAPI,
    ...ProductCategoriesAPI // TODO remvoe ths for later
}

function getAPI(apiType){
    
    return platformRef;
}

function getAPIMap(actionCategory){
    let apiHandler;
    return APIMap;
}

export const executeQuery = async (requestProps) => {

    const {action, actionCategory, params, onSuccess, onFailure} = requestProps;

    const requestApiMap = getAPIMap(actionCategory)
    const {getUrl, method, apiType,getConfigParams, transformResponse} = requestApiMap[action];
    //const url = "http://161.156.175.40:8080/guacamole/api"+ getUrl({platformToken:getPlatformToken()});
    //const url2 = "https://jsonplaceholder.typicode.com/posts"


    const url = getUrl(params);
    const apiHandler = getAPI(apiType)
    const httpMethod = method ? method: "GET";
    let queryConfig =  {url, method};
    if(method === "delete"){
        queryConfig =  {url, method};
    }
    else if(method === "post"){
        queryConfig = getConfigParams ? getConfigParams(params):{}

        queryConfig =  queryConfig.headers ? {
            url,
            method,
            data:queryConfig.data,
            headers:{...config.headers,...queryConfig.headers}
        }:
        {
            url,
            method,
            data:queryConfig.data
        }
    }

    else if(!method){
        queryConfig = {url,   method: 'get'}
    }
  if(apiType === "platform" && action === "logout"){
         unSetAuthToken();}
       let axiosConfig =transformResponse? {
        ...queryConfig,
        transformResponse:[function(data){

            const responseData = transformResponse(JSON.parse(data));

            return transformResponse(responseData)
        }]
       }:queryConfig;
       let response;

        if(method === "put" && actionCategory === "google") {
            response =  await axios.put("PUT_CREATE_URL_HERE", params);
        }
        else if(onSuccess){
                 apiHandler.request({
                ...axiosConfig
             }).then(response => onSuccess(response.data))
            .catch(function (error) {
                console.log(error);
                onFailure(error)
            })
        }
        else{
           response =   await apiHandler.request({
            ...axiosConfig,
            retry: 1,
            retryDelay: 1000
         });
       }
       return response ?   response.data: response;

}


const API = {
 executeQuery,

}
export default API;