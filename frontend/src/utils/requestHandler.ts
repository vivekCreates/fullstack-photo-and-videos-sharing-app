
import { type AxiosResponse } from "axios";
import type { APISuccessResponseInterface } from "../types/api";

export const requestHandler = async (
    api: () => Promise<AxiosResponse<APISuccessResponseInterface, any>>,
    setLoading: (loading: boolean) => void,
    onSuccess: (data: APISuccessResponseInterface) => void,
    onError: (error: string) => void
) => {
    try {
        setLoading && setLoading(true);
        const response = await api();
        const { data } = response;


        if (!data?.success) {
            throw new Error(data.message)
        }
        onSuccess(data)
    } catch (error: any) {
        onError(error.message);
    } finally {
        setLoading(false)
    }
}