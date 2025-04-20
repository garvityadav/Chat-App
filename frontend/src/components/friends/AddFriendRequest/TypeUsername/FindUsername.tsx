import axios from "axios";
import React, { SetStateAction, useState } from "react";
import { IFriendDetail } from "../AddFriendRequest";
import "./FindUsername.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface TypeUsernameProps {
  setFriendDetail: React.Dispatch<SetStateAction<IFriendDetail | undefined>>;
  setError: React.Dispatch<SetStateAction<string>>;
}

const FindUsername: React.FC<TypeUsernameProps> = ({
  setFriendDetail,
  setError,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    hashTag: "",
  });
  const [cache, setCache] = useState(""); //to prevent sending same requests

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
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
      if (!formData.username || !formData.hashTag) {
        return;
      }
      if (`${formData.username}#${formData.hashTag}` == cache) {
        return;
      }
      setCache(`${formData.username}#${formData.hashTag}`);
      const response = await axios.get(
        `${backendUrl}/user/search-user?username=${formData.username}&hashTag=${formData.hashTag}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        setFriendDetail(response.data.data);
      }
    } catch (error: unknown) {
      setFriendDetail(undefined);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("User not found");
      }
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data.message);
      }
      console.log(error);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      if (`${formData.username}#${formData.hashTag}` == cache) {
        return;
      }
      if (!formData.username || !formData.hashTag) {
        return;
      }
      handleRequest(e);
    }
  };
  return (
    <form className='flex flex-row' onKeyDown={handleKeyDown}>
      <label className='label' htmlFor='username'>
        Username
      </label>
      <input
        className='input'
        type='text'
        name='username'
        placeholder='username'
        id='username'
        maxLength={8}
        minLength={4}
        onChange={handleChange}
      />
      <span className='counter'>{8 - formData.username.length}</span>
      <label className='label' htmlFor='hashTag'>
        #
      </label>
      <input
        className='input'
        type='text'
        maxLength={4}
        minLength={4}
        name='hashTag'
        placeholder='hash-tag'
        id='hashTag'
        onChange={handleChange}
      />
      <span className='counter'>{4 - formData.hashTag.length}</span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 16 16'
        fill='currentColor'
        className='size-6 hover:invert relative m-4'
        onClick={handleRequest}
      >
        <path
          fillRule='evenodd'
          d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
          clipRule='evenodd'
        />
      </svg>
    </form>
  );
};

export default FindUsername;
