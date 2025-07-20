import Vapi from "@vapi-ai/web"
const vapi_api = import.meta.env.VITE_PUBLIC_VAPI_WEB_TOKEN;

export const vapi = new Vapi(vapi_api);
