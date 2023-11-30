/* eslint-disable react-hooks/exhaustive-deps */
// App.tsx

import React, { useState, useEffect } from "react";
import "./App.css";
import FontData from "./Data/eazel-frontend-assignment.json";
import { GoogleFontsData } from "./type";

const App: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>("");
  const [fontWeights, setFontWeights] = useState<string[]>([]);
  const [fontWeight, setFontWeight] = useState<string>("");
  const [italic, setItalic] = useState<boolean>(false);

  // Replace this with your actual Google Fonts data
  const googleFontsData: GoogleFontsData = FontData;

  

  // Function to update font weights based on selected font family
  const updateFontWeights = () => {
    const fontVariants = googleFontsData[fontFamily] || {};
    setFontWeights(Object.keys(fontVariants));
  };

  

  // Function to save text and font settings to local storage
  const saveText = () => {
    localStorage.setItem("editorContent", content);
    localStorage.setItem("selectedFont", fontFamily);
    localStorage.setItem("selectedWeight", fontWeight);
    localStorage.setItem("isItalic", italic.toString());
    alert("Text saved successfully!");
  };

  // Function to load saved text from local storage
  const loadSavedText = () => {
    const savedContent = localStorage.getItem("editorContent");
    const savedFont = localStorage.getItem("selectedFont");
    const savedWeight = localStorage.getItem("selectedWeight");
    const savedItalic = localStorage.getItem("isItalic");

    // Load content
    if (savedContent) {
      setContent(savedContent);
    }

    // Load font family
    if (savedFont) {
      setFontFamily(savedFont);
      updateFontWeights();
      // Load font dynamically when font family is loaded from local storage
      loadFont();
    }

    // Load font weight
    if (savedWeight) {
      setFontWeight(savedWeight);
    }

    // Load italic
    if (savedItalic) {
      setItalic(savedItalic === "true");
    }
  };

  // Function to load font dynamically using @font-face rule
  const loadFont = () => {
    const fontVariants = googleFontsData[fontFamily] || {};
    const fontStyles = Object.keys(fontVariants).map((weight) => {
      const fontStyle = weight.includes("italic") ? "italic" : "normal";
      return `
        @font-face {
          font-family: '${fontFamily}';
          font-style: ${fontStyle};
          font-weight: ${parseInt(weight)};
          src: url('${fontVariants[weight]}') format('woff2');
        }
      `;
    });
    const styleElement = document.createElement("style");
    styleElement.textContent = fontStyles.join("\n");
    document.head.appendChild(styleElement);
  };

  // Function to reset all settings and clear local storage
  const resetAll = () => {
    setContent("");
    setFontFamily("");
    setFontWeights([]);
    setFontWeight("");
    setItalic(false);
    // Clear relevant items from local storage
    localStorage.removeItem("editorContent");
    localStorage.removeItem("selectedFont");
    localStorage.removeItem("selectedWeight");
    localStorage.removeItem("isItalic");
  };
  useEffect(() => {
    // Load saved text on component mount
    loadSavedText();
  }, []);

  useEffect(() => {
    // Update font weights when font family changes
    updateFontWeights();
    // Load font dynamically when font family changes
    loadFont();
  }, [fontFamily]);

  useEffect(() => {
    
    if(italic&&!fontWeight.includes('italic')){
      setFontWeight(fontWeight+'italic')
    } else if(!italic&&fontWeight.includes('italic')){
      setFontWeight(fontWeight.replace('italic',""))
      
    }
  }, [italic]);
  useEffect(() => {
    if(italic&&!fontWeight.includes('italic')){
      setItalic(false)
  
    } else if(!italic&&fontWeight.includes('italic')){
      setItalic(true)
  
    }

  }, [fontWeight]);
  return (
    <div className="App">
      <div className="top">
        <label htmlFor="font-family">Font Family:</label>
        <select
          className="DropDown"
          id="font-family"
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
        >
          {Object.keys(googleFontsData).map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <label htmlFor="font-weight">Font Weight:</label>
        <select
          className="DropDown"
          id="font-weight"
          value={fontWeight}
          onChange={(e) => setFontWeight(e.target.value)}
        >
          {fontWeights.map((weight) => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
        <div>
          <label className="ItalicSwitch" htmlFor="italic">
            Italic:
          </label>
          <input
            className="ItalicSwitch"
            type="checkbox"
            id="italic"
            hidden
            checked={italic}
            onChange={(e) => setItalic(!italic)}
          />
          <label className="switch" htmlFor="italic"></label>
        </div>
      </div>

      <div className="textarea-box">
        <textarea
          name="textarea"
          onChange={(e) => {
            e.preventDefault();
            setContent(e.target.value);
          }}
          style={{
            fontFamily: fontFamily,
            fontWeight: fontWeight.replace('italic',""),
            fontStyle: italic ? "italic" : "normal",
          }}
          id="textarea"
          value={content}
          placeholder="Enter message"
        ></textarea>
      </div>
      <div>
        <button className="Button" onClick={saveText}>
          Save
        </button>
        <button className="Button ResetButton" onClick={resetAll}>
          Reset All
        </button>
      </div>
    </div>
  );
};

export default App;
