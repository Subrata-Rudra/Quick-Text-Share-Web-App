import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../App.css";

function ShowTextPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [textData, setTextData] = useState("");

  useEffect(() => {
    if (errorMessage !== "") {
      const errorBox = document.getElementById("errorBox");
      errorBox.innerText = errorMessage;
      errorBox.classList.remove("invisible");
    }
  }, [errorMessage]);

  const getTextFromCloud = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch text file from cloud");
      }
      const textContent = await response.text();
      return textContent;
    } catch (error) {
      console.error("Error reading the text file. ERROR: " + error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const backendServerUrl =
      import.meta.env.VITE_BACKEND_SERVER_URL + "/" + token;
    try {
      const response = await fetch(backendServerUrl);

      const data = await response.json();

      if (response.status === 200) {
        const textBox = document.getElementById("textBox");
        const shareTokenBox = document.getElementById("shareTokenBox");
        const copyBtn = document.getElementById("copyBtn");
        textBox.innerText = await getTextFromCloud(data.url);
        textBox.classList.remove("invisible");
        shareTokenBox.innerText = "Token: " + token;
        shareTokenBox.classList.remove("invisible");
        copyBtn.classList.remove("invisible");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("API request to backend failed. ERROR: " + error);
      setErrorMessage(error);
    }
  };

  const goToSaveTextPage = () => {
    navigate("/");
  };

  const copyTextToClipboard = () => {
    const text =
      document.getElementById("textBox").innerText ||
      document.getElementById("textBox").value;
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Helmet>
        <title>QuikText-See</title>
        <meta
          name="description"
          content="This is the show text page os quick text share website."
        />
        <meta name="keywords" content="text, online, show, share, instant" />
      </Helmet>
      <div className="mainDiv">
        <h1 id="mainHeading">
          QuikText - share any text with others in seconds
        </h1>
        <button id="goToSavePageBtn" onClick={goToSaveTextPage}>
          Share Text
        </button>
        <input
          type="text"
          placeholder="Enter the 4 digit token here"
          onChange={(e) => {
            setToken(e.target.value);
          }}
        />
        <button id="showBtn" onClick={handleSubmit}>
          Show
        </button>
        <button
          id="copyBtn"
          className="invisible"
          onClick={copyTextToClipboard}
        >
          Copy Text
        </button>
        <div id="textBox" className="invisible"></div>
        <div id="shareTokenBox" className="invisible"></div>
        <div
          style={{ color: "red", margin: "1rem", fontSize: "1.2rem" }}
          id="errorBox"
          className="invisible"
        ></div>
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

export default ShowTextPage;
