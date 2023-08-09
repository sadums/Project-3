import React from 'react'
import { useState, useRef, useEffect } from "react";
import PictureUploader from '../pictureUploader';
import VideoUploader from '../videoUploader';
import { ADD_POST } from "../../GraphQL/mutations";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import Auth from '../../(utils)/auth'

type CreateAPostProps = {
  setDisplayPosts: React.Dispatch<React.SetStateAction<any[] | null>>;
};




//REDO THIS BUT WITH USEREF NOT  EVENT TARGETING
//CLEAR PICTURE STATE
function CreateAPost({ setDisplayPosts }: CreateAPostProps) {

    const [addPostMutation, { loading: loading, error: error, data: data }] =
    useMutation(ADD_POST);

    const [createPostDiv, setCreatePostDiv] = useState(false);
    const [uploadTypeState, setUploadTypeState] = useState("");
    const [hashtags, addHashtags] = useState<string[]>([]);
    const [pictureState, setPictureState] = useState<{
        cropped: string;
        original: string;
      }>({
        cropped: "",
        original: "",
      });
    
      const [videoState, setVideoState] = useState<{
        thumbnail: string;
        video: string;
      }>({
        thumbnail: "",
        video: "",
      });

      const inputRef = useRef<HTMLInputElement>(null);

    const handleHashtagAddition = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        event.preventDefault();
        if (inputRef.current && inputRef.current.value) {
          const newHashtag = inputRef.current.value;
          addHashtags((prev) => [...prev, newHashtag]);
          inputRef.current.value = "";
        }
      };

      const handleSetPictureState = (url: {
        cropped: string;
        original: string;
      }): void => {
        setPictureState(url);
      };

    const pictureButtonHandler = () => {
        setUploadTypeState("picture");
      };
    
      const videoButtonHandler = () => {
        setUploadTypeState("video");
      };

      const createPostHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
          const target = event.target as HTMLFormElement;
          type HashtagInput = {
            hashtagText: string;
          };
          const inputHashtags: HashtagInput[] = [];
          hashtags.forEach((tag) => {
            inputHashtags.push({ hashtagText: tag });
          });
          const postInput = {
            preview: "",
            media: "",
            title: target.form[1].value,
            body: target.form[2].value,
            hashtags: inputHashtags,
          };
    
          if (uploadTypeState === "picture") {
            postInput.preview = pictureState.cropped;
            postInput.media = pictureState.original;
          }
    
          if (uploadTypeState === "video") {
            postInput.preview = videoState.thumbnail;
            postInput.media = videoState.video;
          }
          console.log(postInput);
          if (
            postInput.title &&
            postInput.preview &&
            postInput.media &&
            postInput.body
          ) {
            const id = Auth.getProfile().data._id;
            const response = await addPostMutation({
              variables: {
                input: postInput,
                userId: id,
              },
            });
            console.log(response);
            console.log(response.data)
            const newPost = response.data.addPost
            setDisplayPosts((prev) => [newPost, ...(Array.isArray(prev) ? prev : [])]);
            setCreatePostDiv((prev) => !prev);
          } else {
            alert("Please fill out all fields");
          }
        } catch (err) {
          console.error(err);
        }
      };

  return (
    <div
    className={` ease-in-out duration-300 ${
      createPostDiv
        ? "w-[90%]  bg-white dark:bg-coolGray rounded-xl dark:shadow-notificationShadowPink shadow-xl p-2"
        : "w-[50%]"
    }`}
  >
    <button
      onClick={() => {
        setCreatePostDiv((prev) => !prev);
      }}
      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 hover:scale-105 ${
        createPostDiv ? "hidden" : "block"
      }`}
    >
      Create A Post
    </button>

    <div
      className={`relative ml-0 ${
        createPostDiv ? "block" : "hidden"
      }`}
    >
      <form>
        <div className="">
          <button
            className={`absolute top-0 right-0 z-50 dark:text-white text-black ${
              createPostDiv ? "block" : "hidden"
            }`}
            onClick={() => {
              setCreatePostDiv(!createPostDiv);
            }}
          >
          </button>
        </div>
        <div className="">
          <h2 className="text-sm text-neonBlue font-semibold">
            Post Title:
          </h2>
          <input
            type="text"
            id=""
            placeholder="Title"
            className="dark:text-white text-black bg-transparent border-solid border-neonBlue border-t-0 border-r-0 border-l-0 border-b-2 outline-none w-[100%]"
          ></input>
        </div>
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-neonBlue">
            Description:
          </h2>
          <textarea
            placeholder="Description, 400 max chars"
            className="bg-transparent border-solid border-neonBlue border-t-0 border-r-0 border-l-0 border-b-2 outline-none w-[100%] h-20 max-h-20 dark:text-white text-black"
          ></textarea>
        </div>
        <div className="mt-4 border-neonBlue border-t-0 border-r-0 border-l-0 border-b-2 pb-1">
          <h2 className="text-sm font-semibold text-neonBlue">
            Media:
          </h2>
          <div className="flex">
            <div onClick={pictureButtonHandler}>
              {uploadTypeState !== "video" && (
                <PictureUploader
                  pictureState={pictureState}
                  setPictureState={handleSetPictureState}
                  uploadText={"Upload Picture"}
                />
              )}
            </div>
            <div onClick={videoButtonHandler}>
              {uploadTypeState !== "picture" && (
                <VideoUploader
                  uploadText={"Upload Video"}
                  videoState={videoState}
                  setVideoState={setVideoState}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <h2 className="text-sm font-semibold text-neonBlue">
            Hashtags:
          </h2>
          <div className="flex">
            {hashtags.map((tag, index) => (
              <div key={index}>
                <h4 className="dark:text-white text-black mr-1">
                  #{tag}
                </h4>
              </div>
            ))}
          </div>
          <input
            type="text"
            ref={inputRef}
            id=""
            placeholder="Hashtag"
            className="dark:text-white text-black mt-2 bg-transparent border-solid border-neonBlue border-t-0 border-r-0 border-l-0 border-b-2 outline-none w-[20%]"
          ></input>
          <button
            type="button"
            className="pl-2 dark:text-white text-black border-neonBlue border-t-0 border-r-0 border-l-0 border-b-2 hover:text-neonBlue ease-in-out transition duration-100"
            onClick={handleHashtagAddition}
          >
            Add
          </button>
        </div>
        <button
          onClick={createPostHandler}
          className="block px-4 mt-2 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 hover:scale-105"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  </div>
  )
}

export default CreateAPost;