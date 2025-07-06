// Landon Stucki
// 6/20/2025 JSX/CSS
// React Preview Tool
import React, { useState } from "react"; // import React and useState hook
import "./styles.css"; // import our external stylesheet

// === TEMPLATE LIBRARIES ===
// Array of libraries, with names and lists of image path.
const libraries = [
  { name: "Magic", templates: [
      "wizard_realm/broom1.png",
      "wizard_realm/castle1.png",
      "wizard_realm/owl1.png",
      "wizard_realm/wand1.png"
    ]
  },
  { name: "Space", templates: [
      "space_realm/blaster1.png",
      "space_realm/helmet1.png",
      "space_realm/ship1.png"
    ]
  },
  { name: "Norse Myth", templates: [
      "norse_myth/axesymbol1.png",
      "norse_myth/hammersymbol1.png",
      "norse_myth/ravens1.png",
      "norse_myth/wolf1.png"
    ]
  },
  { name: "Astrology", templates: [
      "astrology/crab.png",
      "astrology/lion.png",
      "astrology/ram1.png",
      "astrology/twoface.png"
    ]
  },
  { name: "Birth Flower", templates: [
      "birth_flowers/janflower.png",
      "birth_flowers/febflower.png",
      "birth_flowers/marflower.png",
      "birth_flowers/aprflower.png",
      "birth_flowers/mayflower.png",
      "birth_flowers/junflower.png",
      "birth_flowers/julyflower.png",
      "birth_flowers/augflower.png",
      "birth_flowers/septflower.png",
      "birth_flowers/octflower.png",
      "birth_flowers/novflower.png",
      "birth_flowers/decflower.png"
    ]
  },
  { name: "Birth Stone", templates: [
      "birth_stone/janstone.png",
      "birth_stone/febstone.png",
      "birth_stone/marstone.png",
      "birth_stone/aprstone.png",
      "birth_stone/maystone.png"
    ]
  },
  { name: "Creature", templates: ["creatures/dragon.png"] },
  { name: "Greek Myth", templates: ["picture.png", "picture.png"] }
];

// === CHECKOUT ITEMS ===
// Array of bottle items available for purchase and their ID's.
const checkoutItems = [
  // User will pick item from shop.
  { name: "Blue 32 oz Bottle",  id: 1, image: "bottle_blue_32.png",  price: 25 },
  { name: "Brown 32 oz Bottle", id: 2, image: "bottle_brown_32.png", price: 25 },
  { name: "Brown 25 oz Bottle", id: 5, image: "bottle_brown_32.png", price: 30 },
  { name: "Black 32 oz Bottle", id: 3, image: "bottle_black_32.png", price: 25 },
  { name: "Blue 32 oz Bottle",  id: 4, image: "bottle_blue_32.png",  price: 25 }
];

// Build empty customizable slots using KEYS with an ID as such.
const initialItemData = checkoutItems.reduce((acc, item) => {
  acc[item.id] = { line1: "", line2: "", font1: "", font2: "", overlayImg: null };
  return acc;
}, {});

export default function App() {
  // --- USE STATES ---
  const [selectedItem, setSelectedItem] = useState(checkoutItems[0]); // currently selected bottle
  const [itemData, setItemData] = useState(initialItemData); // customization data for items
  const [cart, setCart] = useState([]); // items added to cart
  const [selectedLibrary, setSelectedLibrary] = useState(null); // currently selected template library

  // Pull out current customization for the selected bottle by id.
  const { line1, line2, font1, font2, overlayImg } = itemData[selectedItem.id];

  // Generic setter for any field of the current bottle's customization.
  const setItemField = (field, value) => {
    setItemData(prev => ({
      ...prev,
      [selectedItem.id]: {
        ...prev[selectedItem.id],
        [field]: value
      }
    }));
  };

  // Toggle a library template on/off for the current bottle.
  const toggleTemplate = src => {
    setItemField("overlayImg", overlayImg === src ? null : src);
  };

  // Pricing calculation for the currently selected customization.
  const basePrice = selectedItem.price; // base price of bottle
  const line1Price = line1 ? 3 : 0; // extra fee if line1 text present
  const line2Price = line2 ? 3 : 0; // extra fee if line2 text present
  const templatePrice = overlayImg ? 6 : 0; // extra fee if template overlay selected
  const totalItemPrice = basePrice + line1Price + line2Price + templatePrice; // sum total

  // Finalize current customization and add item to cart.
  const handleFinalize = () => {
    const finalized = {
      id: selectedItem.id,
      name: selectedItem.name,
      image: selectedItem.image,
      price: totalItemPrice,
      line1, line2, font1, font2,
      template: overlayImg || null
    };
    setCart(prev => [...prev, finalized]); // Add to the 'finalized' Array.
    alert("Item added to cart.");
  };

  // Display cart contents in an alert popup.
  const handleCheckCart = () => {
    if (cart.length === 0) {
      alert("Your cart is empty."); // No items alert.
      return;
    }
    const details = cart.map((item, idx) =>
      `Item ${idx + 1}:
  Name: ${item.name}
  Line 1: "${item.line1}" (Font: ${item.font1})
  Line 2: "${item.line2}" (Font: ${item.font2})
  Template: ${item.template || "None"}
  Price: $${item.price}`
    ).join("\n\n");
    alert(details); // Show the 'combined' mapped array of items in cart.
  };

  return (
    <div>
      {/* MAIN TOOLBOX container for preview and controls */}
      <div className="preview-toolbox">

        {/* LEFT PANEL: product preview & bottle selection buttons */}
        <div className="left-panel">
          <div className="product-header">{selectedItem.name}</div>
          <div className="product-preview">
            <div className="preview-image-container">
              <img
                id={`bottle-image-${selectedItem.id}`} // unique id per bottle
                src={selectedItem.image} // bottle image source
                alt="Bottle Preview" // accessibility text
              />
              {/* Dynamic inline fontFamily kept here because it’s user-chosen. */}
              <div className="overlay-text line1-text" style={{ fontFamily: font1 }}>
                {line1}
              </div>
              <div className="overlay-img">
                {overlayImg && <img src={overlayImg} alt="Overlay Icon" />} {/* template icon */}
              </div>
              <div className="overlay-text line2-text" style={{ fontFamily: font2 }}>
                {line2}
              </div>
            </div>
          </div>
          <div className="cart-item">
            <h3>Choose Checkout Item</h3>
            <div className="checkout-list">  {/* Scrollable list of bottles. */}
              {checkoutItems.map(item => (
                <button key={item.id} onClick={() => setSelectedItem(item)}>
                  {item.name} (${item.price})   {/* Button text shows name and price. */}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: customization controls for text and templates */}
        <div className="right-panel">
          <div className="text-creator-header"><h1>Text Customization</h1></div>
          <div className="text-selector">
            {/* LINE 1 customization row */}
            <div className="text-line">
              <label>Line 1</label>
              <select value={font1} onChange={e => setItemField("font1", e.target.value)}>
                <option value="" disabled>Choose Font</option>
                {fontOptions.map(f => <option key={f} value={f}>{f.split(",")[0]}</option>)}
              </select>
              <input
                type="text"
                placeholder="Text Input 1"
                value={line1}
                onChange={e => setItemField("line1", e.target.value)}
              />
              {line1 && <div className="fee-note">+ $3.00</div>} {/* extra fee note */}
            </div>

            {/* LINE 2 customization row */}
            <div className="text-line">
              <label>Line 2</label>
              <select value={font2} onChange={e => setItemField("font2", e.target.value)}>
                <option value="" disabled>Choose Font</option>
                {fontOptions.map(f => <option key={f} value={f}>{f.split(",")[0]}</option>)}
              </select>
              <input
                type="text"
                placeholder="Text Input 2"
                value={line2}
                onChange={e => setItemField("line2", e.target.value)}
              />
              {line2 && <div className="fee-note">+ $3.00</div>} {/* extra fee note */}
            </div>
          </div>

          {/* TEMPLATE LIBRARIES list */}
          <div className="library-header"><h1>Library Templates</h1></div>
          <div className="library-selector">
            {libraries.map(lib => (
              <div
                key={lib.name}
                className={`library-box ${selectedLibrary?.name === lib.name ? "selected" : ""}`}
                onClick={() => setSelectedLibrary(lib)}>
                <button>{lib.name}</button> {/* library name button */}
              </div>
            ))}
          </div>

          {/*<div className="upload-button"><button>Custom Upload</button></div> {/* upload custom image button */}

          {/* display templates for selected library */}
          <div className="template-browser">
            {selectedLibrary?.templates.map(src => (
              <div className="template-box" key={src}>
                <button
                  className={`template-button ${overlayImg === src ? "selected" : ""}`}
                  onClick={() => toggleTemplate(src)}>
                  <img src={src} alt="Template Preview" /> {/* show template preview */}
                </button>
              </div>
            ))}
          </div>

          {overlayImg && <div className="overlay-fee">+ $6.00</div>} {/* fee for template overlay */}

          {/* FINALIZE & ADD TO CART button */}
          <div className="text-center">
            <button className="btn-finalize" onClick={handleFinalize}>
              <div><strong>{selectedItem.name}</strong> (${basePrice})</div>
              {line1 && <div>Line 1: +$3.00</div>}
              {line2 && <div>Line 2: +$3.00</div>}
              {overlayImg && <div>Template: +$6.00</div>}
              <div style={{ marginTop: "2px" }}>
                <strong>Finalize & Add to Cart – Total: ${totalItemPrice}</strong>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER: checkout total & check cart button */}
      <div className="preview-footer">
        <button>
          Total  (${cart.reduce((sum, item) => sum + item.price, 0)})
        </button>
        <button onClick={handleCheckCart} className="check-cart">Check Cart</button>
      </div>
    </div>
  );
}

// === FONT OPTIONS ===
// list of available font-family strings for dropdown menus
const fontOptions = [
  "Arial, sans-serif", "Arial Black, Gadget, sans-serif", "Helvetica, sans-serif",
  "Verdana, sans-serif", "Tahoma, sans-serif", "'Trebuchet MS', sans-serif",
  "Calibri, sans-serif", "Geneva, sans-serif", "Times New Roman, serif",
  "Georgia, serif", "Cambria, serif", "Garamond, serif",
  "Palatino, 'Palatino Linotype', serif", "'Book Antiqua', serif",
  "Courier, monospace", "Courier New, monospace", "Consolas, monospace",
  "'Lucida Console', monospace", "Monaco, monospace", "'Comic Sans MS', cursive",
  "Brush Script MT, cursive", "Impact, fantasy", "fantasy",
  "sans-serif", "serif", "monospace", "cursive", "fantasy"
];
