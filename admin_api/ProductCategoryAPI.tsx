import GeneralAPI from "./GeneralAPI";
const BASE_URL = "http://localhost:5000/product_category";
const API_TYPE = "productCategory";

const ProductCategoryAPI = GeneralAPI(BASE_URL, API_TYPE);
export default ProductCategoryAPI;
