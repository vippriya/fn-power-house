import GeneralAPI from "./GeneralAPI";
const BASE_URL = "http://localhost:5000/application_reference";
const API_TYPE = "applicationReference";

const ApplicationReferenceAPI = GeneralAPI(BASE_URL, API_TYPE);
export default ApplicationReferenceAPI;
