
import { AxiosResponse } from "axios";
import type { APISuccessResponseInterface } from "../types/api";

export const requestHandler = async(
    api:()=>Promise<AxiosResponse<APISuccessResponseInterface,any>>,
     onSuccess: (data: APISuccessResponseInterface) => void,
     onError: (error: string) => void
)=>{
    try {
    const response = await api();
    const { data } = response;
    if (data?.success) {
      onSuccess(data);
    }
  } catch (error: any) {
    console.log(error);
    onError(error?.response?.data?.message || "Something went wrong");
}
}