// to fetch using axios
import axios from "axios";

export const axiosFetch = async (
  method: string,
  url: string,
  data?: object
) => {
  try {
    const response = await axios({
      method: method,
      url: url,
      data: data,
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
