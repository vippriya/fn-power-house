import GeneralAPI from "./GeneralAPI";
const BASE_URL = "http://localhost:5000/product";
const API_TYPE = "product";

const ProductAPI = GeneralAPI(BASE_URL, API_TYPE);
export default ProductAPI;
