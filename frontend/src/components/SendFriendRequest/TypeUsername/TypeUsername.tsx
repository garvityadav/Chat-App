import axios from "axios";
import React, { SetStateAction, useState } from "react";
import { IFriendDetail } from "../SendFriendRequest";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface TypeUsernameProps {
  setFriendDetail: React.Dispatch<SetStateAction<IFriendDetail | undefined>>;
}

const TypeUsername: React.FC<TypeUsernameProps> = ({ setFriendDetail }) => {
  const [formData, setFormData] = useState({
    username: "",
    hashTag: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/\s/.test(value)) {
      alert("Spaces are not allowed!");
      return;
    }

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      return newData;
    });
  };
  const handleRequest = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${backendUrl}/user/search-user?username=${formData.username}&hashTag=${formData.hashTag}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        setFriendDetail(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <label htmlFor='username'>Username: </label>
      <input
        type='text'
        name='username'
        id='username'
        onChange={handleChange}
      />
      <label htmlFor='hashTag'> #</label>
      <input type='text' name='hashTag' id='hashTag' onChange={handleChange} />
      <button type='submit' onClick={handleRequest}>
        Find User
      </button>
    </>
  );
};

export default TypeUsername;
