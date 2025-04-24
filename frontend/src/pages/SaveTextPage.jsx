import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../App.css";

function SaveTextPage() {
  const navigate = useNavigate();
  const [textData, setTextData] = useState("");
  const [expiresIn, setExpiresIn] = useState(60);
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const uploadTextToCloudinary = async () => {
    const file = new Blob([textData], { type: "text/plain" });
    if (textData === "") {
      return;
    }
    const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Quick Text Share App Preset");
    formData.append("folder", "Quick Text Share App Text Files");
    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const publicId = data.public_id.split("/")[1];
      const result = {
        fileUploadedUrl: data.secure_url,
        filePublicId: data.public_id,
      };
      return result;
    } catch (error) {
      console.error("Upload failed. ERROR: " + error);
      return "";
    }
  };

  const handleSubmit = async () => {
    document.getElementById("tokenPart").classList.remove("invisible");
    document.getElementById("loaderIcon").classList.remove("invisible");
    let fileUploadedData = await uploadTextToCloudinary();

    if (
      !fileUploadedData &&
      !fileUploadedData.fileUploadedUrl &&
      !fileUploadedData.filePublicId
    ) {
      setErrorMessage("Failed to upload text file to cloud.");
      return;
    }

    const backendServerUrl = import.meta.env.VITE_BACKEND_SERVER_URL;

    const requestData = {
      url: fileUploadedData.fileUploadedUrl,
      publicId: fileUploadedData.filePublicId,
      expiresInMinutes: expiresIn,
    };
    try {
      const response = await fetch(backendServerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      document.getElementById("loaderIcon").classList.add("invisible");
      if (response.status === 200) {
        setToken(data.token);
        setTextData("");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("API request failed. ERROR: " + error);
      setErrorMessage(error);
    }
    document.getElementById("copyTokenBtn").classList.remove("invisible");
  };

  const goToShowTextPage = () => {
    navigate("/show");
  };

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(token);
  };

  return (
    <>
      <Helmet>
        <title>QuikText-Share</title>
        <meta
          name="description"
          content="This is the show text page os quick text share website."
        />
        <meta
          name="keywords"
          content="text, show, online, instant, save, share"
        />
      </Helmet>
      <div className="mainDiv">
        <h1 id="mainHeading">
          QuikText - share any text with others in seconds
        </h1>
        <button id="goToShowPageBtn" onClick={goToShowTextPage}>
          See Text
        </button>
        <div id="tokenPart" className="invisible">
          <div id="loaderIcon" className="invisible">
            <div id="loaderContainer">
              <div className="loader"></div>
            </div>
          </div>
          {errorMessage === "" && (
            <div>
              Share Token Code: <b>{token}</b>
              <button
                id="copyTokenBtn"
                className="invisible"
                onClick={copyTokenToClipboard}
              >
                Copy
              </button>
            </div>
          )}
          {errorMessage !== "" && <p>Error: {errorMessage}</p>}
        </div>
        <textarea
          name="board"
          id="board"
          placeholder="Just type or paste your text here"
          value={textData}
          onChange={(e) => {
            setTextData(e.target.value);
          }}
        ></textarea>
        <div id="submitDiv">
          <button id="shareBtn" onClick={handleSubmit}>
            Share
          </button>
          <label htmlFor="expiryTime">Expires in </label>
          <select
            value={expiresIn}
            name="expiryTime"
            id="expiresIn"
            onChange={(e) => {
              setExpiresIn(e.target.value);
            }}
          >
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">1 hour</option>
            <option value="240">4 hours</option>
            <option value="480">8 hours</option>
            <option value="1440">1 day</option>
          </select>
        </div>
      </div>
      <div id="footer">
        Made with 🖤 by{" "}
        <a href="https://github.com/Subrata-Rudra" target="_blank">
          Subrata Rudra
        </a>
      </div>
    </>
  );
}

export default SaveTextPage;
