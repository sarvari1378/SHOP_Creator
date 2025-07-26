// Token encoding/decoding functions
function encodeToken(token) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let encoded = "";
  for (let i = 0; i < token.length; i++) {
    const char = token[i];
    const index = alphabet.indexOf(char);
    if (index !== -1) {
      const newIndex = (index + 5) % alphabet.length;
      encoded += alphabet[newIndex];
    } else {
      encoded += char;
    }
  }
  return encoded;
}

function decodeToken(encoded) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let decoded = "";
  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i];
    const index = alphabet.indexOf(char);
    if (index !== -1) {
      const newIndex = (index - 5 + alphabet.length) % alphabet.length;
      decoded += alphabet[newIndex];
    } else {
      decoded += char;
    }
  }
  return decoded;
}

// Helper function to get the GitHub token.
function getToken() {
  const part1 = "Gjfwjw l";
  const part2 = "mu_ciDwOB1h";
  const part3 = "DNR8tga6kA";
  const part4 = "t6VmMy7Lq";
  const part5 = "Yhs7D1uew";
  const ajaghvajagh = part1 + part2 + part3 + part4 + part5;
  return decodeToken(ajaghvajagh);
}

document.addEventListener("DOMContentLoaded", function () {
  // Base image for the canvas
  const baseImage = new Image();
  baseImage.crossOrigin = "anonymous";
  // template (change)
  baseImage.src = 'https://sarvari1378.github.io/SHOP_Creator/Templates/Abbasi2_template.png';

  // Image objects for overlays
  let ringImg = new Image();
  ringImg.crossOrigin = "anonymous";
  let circleImg = new Image();
  circleImg.crossOrigin = "anonymous";

  // Attach event listeners to inputs
  document.getElementById("ringImageInput").addEventListener("change", function (event) {
    loadImage(event, ringImg);
  });
  document.getElementById("circleImageInput").addEventListener("change", function (event) {
    loadImage(event, circleImg);
  });

  document.getElementById('slider').addEventListener('input', generateImage);
  document.getElementById('sliderx').addEventListener('input', generateImage);
  document.getElementById('slidery').addEventListener('input', generateImage);

  // When code input changes, update the QR code URL.
  document.getElementById("number13").addEventListener("input", function () {
    // Use the extractCode function to get the numeric part of the input
    let codeValue = extractCode(this.value);

    // If no digits are found, clear the QR input and exit
    if (!codeValue) {
      document.getElementById("ringImageInput").value = "";
      return;
    }

    const codeNum = parseInt(codeValue, 10);
    if (!isNaN(codeNum)) {
      // Calculate the item number (adjust as needed)
      const itemNumber = codeNum;

      // Construct the QR code URL
      const qrURL = "https://abba30r.abba30r.workers.dev/" + itemNumber;
      const qrInput = document.getElementById("ringImageInput");
      qrInput.value = qrURL;

      // Dispatch a change event to update the QR image
      const changeEvent = new Event("change");
      qrInput.dispatchEvent(changeEvent);
    }
  });


  // Update text areas on input change (for descriptions)
  document.querySelectorAll("input[type='text']:not(#ringImageInput), textarea")
    .forEach(function (input) {
      input.addEventListener("input", function() {
        generateImage();
        updateTextAreas();
      });
  });

  // Function to load an image (from file or URL)
  function loadImage(event, imgElement) {
    const input = event.target;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        imgElement.src = e.target.result;
        if (input.id === "circleImageInput") {
          window.uploadedRingImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    } else if (input.value) {
      const url = input.value;
      const width = input.dataset.width || 400;
      const height = input.dataset.height || 400;
      imgElement.src =
        "https://quickchart.io/qr?text=" +
        encodeURIComponent(url) +
        "&size=" + width + "x" + height;
    }
  }

  // Redraw canvas when images load
  baseImage.onload = generateImage;
  ringImg.onload = generateImage;
  circleImg.onload = generateImage;

  // Function to generate the canvas image
  function generateImage() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;
    ctx.drawImage(baseImage, 0, 0);
    drawImageWithMode(ctx, ringImg, document.getElementById("ringImageInput"));
    drawCircleImage(ctx, circleImg, document.getElementById("circleImageInput"));
    document.querySelectorAll("input[type='text']:not(#ringImageInput), textarea")
      .forEach(function (input) {
        if(input.id === "englishTextArea" || input.id === "arabicTextArea") return;
        const text = input.value;
        const alignOptions = ["left", "right", "center"];
        const align = alignOptions.includes(input.dataset.align)
          ? input.dataset.align
          : "left";
        const x = parseInt(input.dataset.x, 10) || 50;
        const y = parseInt(input.dataset.y, 10) || 50;
        const font = input.dataset.font || "EnglishFont";
        const color = input.dataset.color || "#ffffff";
        const fontSize = input.dataset.fontsize || "50";
        ctx.font = fontSize + "px " + font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.direction = align === "right" ? "rtl" : "ltr";
        const lines = text.split("\n");
        lines.forEach(function (line, index) {
          const lineHeight = parseInt(fontSize, 10) + 5;
          ctx.fillText(line, x, y + index * lineHeight);
        });
    });
  }

  // Function to draw an image with composite operation (for QR code)
  function drawImageWithMode(ctx, imgElement, inputElement) {
    if (imgElement.src) {
      const x = parseInt(inputElement.dataset.x, 10) || 100;
      const y = parseInt(inputElement.dataset.y, 10) || 100;
      const width = parseInt(inputElement.dataset.width, 10) || 100;
      const height = parseInt(inputElement.dataset.height, 10) || 100;
      ctx.globalCompositeOperation = inputElement.dataset.mode || "normal";
      ctx.drawImage(imgElement, x, y, width, height);
      ctx.globalCompositeOperation = "source-over";
    }
  }

  // Function to draw the circle (ring) image with clipping
  function drawCircleImage(ctx, imgElement, inputElement) {
  const slider = document.getElementById('slider');
  const sliderValue = parseFloat(slider.value);
  const scalePercent = sliderValue * 100;
  const rectWidth = 460;
  const rectHeight = 130;
  const rectColor = "rgba(214, 167, 106, 1)";
  const rectPosition = { x: 800, y: 845 };
  const roundness = 64;

  if (imgElement.src) {
    const x = parseInt(inputElement.dataset.x, 10) || 250;
    const y = parseInt(inputElement.dataset.y, 10) || 250;
    const size = parseInt(inputElement.dataset.width, 10) || 100;

    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = size / 2;

    const newImgWidth = imgElement.width * (scalePercent / 100);
    const newImgHeight = imgElement.height * (scalePercent / 100);

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const sliderx = document.getElementById('sliderx');
    const sliderxValue = parseFloat(sliderx.value);
    const slidery = document.getElementById('slidery');
    const slideryValue = parseFloat(slidery.value);

    const imgX = centerX - newImgWidth / 2 + sliderxValue;
    const imgY = centerY - newImgHeight / 2 + slideryValue;

    ctx.drawImage(imgElement, imgX, imgY, newImgWidth, newImgHeight);

    ctx.beginPath();
    ctx.moveTo(rectPosition.x + roundness, rectPosition.y);
    ctx.arcTo(rectPosition.x + rectWidth, rectPosition.y, rectPosition.x + rectWidth, rectPosition.y + rectHeight, roundness);
    ctx.arcTo(rectPosition.x + rectWidth, rectPosition.y + rectHeight, rectPosition.x, rectPosition.y + rectHeight, roundness);
    ctx.arcTo(rectPosition.x, rectPosition.y + rectHeight, rectPosition.x, rectPosition.y, roundness);
    ctx.arcTo(rectPosition.x, rectPosition.y, rectPosition.x + rectWidth, rectPosition.y, roundness);
    ctx.closePath();
    ctx.restore();
    ctx.fillStyle = rectColor;
    ctx.fill();
  }
}

  // Update description textareas from individual inputs
  function updateTextAreas() {
    const englishInputs = ["number1", "number2", "number3", "number4", "number5", "number6"];
    const arabicInputs = ["number8", "number9", "number10", "number11", "number12", "number19"];
    let englishText = "";
    englishInputs.forEach(id => {
      const input = document.getElementById(id);
      if(input && input.value) {
        englishText += input.value + "\n";
      }
    });
    let arabicText = "";
    arabicInputs.forEach(id => {
      const input = document.getElementById(id);
      if(input && input.value) {
        arabicText += input.value + "\n";
      }
    });
    document.getElementById("englishTextArea").value = englishText.trim();
    document.getElementById("arabicTextArea").value = arabicText.trim();
  }

  // Initially update the text areas.
  updateTextAreas();

      // Function to download the final canvas image with DPI metadata
  function downloadImage() {
    // Hardcoded width, height (in cm), and DPI
    const widthCm = 8.5;  // Example: 10 cm width
    const heightCm = 5.6; // Example: 15 cm height
    const dpi = 300;     // Example: 300 DPI

    // Convert CM to Pixels
    const widthPx = Math.round(widthCm * (dpi / 2.54));
    const heightPx = Math.round(heightCm * (dpi / 2.54));

    // Create a new temporary canvas with new size
    const canvas = document.getElementById('canvas');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = widthPx;
    tempCanvas.height = heightPx;
    const ctx = tempCanvas.getContext('2d');

    // Draw the original canvas content into new size
    ctx.drawImage(canvas, 0, 0, widthPx, heightPx);

    // Convert the canvas to PNG Base64
    const pngDataUrl = tempCanvas.toDataURL('image/png');
    let binary = atob(pngDataUrl.split(',')[1]);
    let array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    // Convert DPI to pixels per meter
    const pixelsPerMeter = Math.round(dpi / 0.0254);
    const pHYsData = new Uint8Array(9);
    for (let i = 0; i < 4; i++) {
      pHYsData[i] = (pixelsPerMeter >>> ((3 - i) * 8)) & 0xFF;
      pHYsData[i + 4] = (pixelsPerMeter >>> ((3 - i) * 8)) & 0xFF;
    }
    pHYsData[8] = 1; // Unit: meters

    // Create pHYs Chunk
    const chunkType = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // "pHYs"
    const lengthBytes = new Uint8Array([0, 0, 0, 9]); // 9-byte chunk

    const crcData = new Uint8Array(chunkType.length + pHYsData.length);
    crcData.set(chunkType, 0);
    crcData.set(pHYsData, chunkType.length);
    const crc = crc32(crcData);
    const crcBytes = new Uint8Array([
      (crc >>> 24) & 0xFF,
      (crc >>> 16) & 0xFF,
      (crc >>> 8) & 0xFF,
      (crc) & 0xFF
    ]);

    const pHYsChunk = new Uint8Array(4 + 4 + 9 + 4);
    pHYsChunk.set(lengthBytes, 0);
    pHYsChunk.set(chunkType, 4);
    pHYsChunk.set(pHYsData, 8);
    pHYsChunk.set(crcBytes, 17);

    // Insert pHYs Chunk into PNG Data
    const signatureLength = 8;
    const ihdrLength = 25;
    const insertPos = signatureLength + ihdrLength;

    const newLength = array.length + pHYsChunk.length;
    let newPng = new Uint8Array(newLength);
    newPng.set(array.slice(0, insertPos), 0);
    newPng.set(pHYsChunk, insertPos);
    newPng.set(array.slice(insertPos), insertPos + pHYsChunk.length);

    // Convert back to Base64 for download
    const newBase64 = uint8ToBase64(newPng);
    const newDataUrl = "data:image/png;base64," + newBase64;

    // Set filename
    const codeInput = document.getElementById('number13').value.trim();
    const fileName = codeInput ? codeInput + ".png" : "image_with_300dpi.png";

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = newDataUrl;
    link.download = fileName;
    link.click();
  }


  function crc32(buf) {
    let table = crc32.table;
    if (!table) {
      table = crc32.table = [];
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
          c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
      }
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }


  function uint8ToBase64(u8Arr) {
    const CHUNK_SIZE = 0x8000;
    let index = 0;
    let result = '';
    while (index < u8Arr.length) {
      let slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, u8Arr.length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return btoa(result);
  }
    window.downloadImage = downloadImage; // Expose to global scope for onclick in HTML

    // New function: uploadRingImage with SHA support
    function uploadRingImage(extractedCode, base64Content) {
      /// Rings images path (change)
      const filePath = 'Images/Abbasi/' + extractedCode + '.jpg';
      const getUrl = 'https://api.github.com/repos/sarvari1378/SHOP_Creator/contents/' + filePath;
      const xhrGet = new XMLHttpRequest();
      xhrGet.open('GET', getUrl, true);
      xhrGet.setRequestHeader('Authorization', getToken());
      xhrGet.onload = function () {
        let sha;
        if (xhrGet.status === 200) {
          const fileInfo = JSON.parse(xhrGet.responseText);
          sha = fileInfo.sha;
        }
        const payload = {
          message: 'Upload ring image for code ' + extractedCode,
          content: base64Content,
          branch: 'main'
        };
        if (sha) {
          payload.sha = sha;
        }
        const putUrl = 'https://api.github.com/repos/sarvari1378/SHOP_Creator/contents/' + filePath;
        const xhrPut = new XMLHttpRequest();
        xhrPut.open('PUT', putUrl, true);
        xhrPut.setRequestHeader('Authorization', getToken());
        xhrPut.setRequestHeader('Content-Type', 'application/json');
        xhrPut.onload = function () {
          if (xhrPut.status >= 200 && xhrPut.status < 300) {
            alert('Workflow triggered and ring image uploaded successfully');
            downloadImage();
          } else {
            alert('Workflow triggered, but error uploading ring image: ' + xhrPut.responseText);
          }
          document.getElementById("loadingOverlay").style.display = "none";
        };
        xhrPut.onerror = function () {
          alert('An error occurred during the image upload request.');
          downloadImage();
          document.getElementById("loadingOverlay").style.display = "none";
        };
        xhrPut.send(JSON.stringify(payload));
      };
      xhrGet.onerror = function () {
        // If GET fails, assume file doesn't exist; create new file.
        const payload = {
          message: 'Upload ring image for code ' + extractedCode,
          content: base64Content,
          branch: 'main'
        };
        const putUrl = 'https://api.github.com/repos/sarvari1378/SHOP_Creator/contents/' + filePath;
        const xhrPut = new XMLHttpRequest();
        xhrPut.open('PUT', putUrl, true);
        xhrPut.setRequestHeader('Authorization', getToken());
        xhrPut.setRequestHeader('Content-Type', 'application/json');
        xhrPut.onload = function () {
          if (xhrPut.status >= 200 && xhrPut.status < 300) {
            alert('Workflow triggered and ring image uploaded successfully');
            downloadImage();
          } else {
            alert('Workflow triggered, but error uploading ring image: ' + xhrPut.responseText);
          }
          document.getElementById("loadingOverlay").style.display = "none";
        };
        xhrPut.onerror = function () {
          alert('An error occurred during the image upload request.');
          downloadImage();
          document.getElementById("loadingOverlay").style.display = "none";
        };
        xhrPut.send(JSON.stringify(payload));
      };
      xhrGet.send();
    }
    window.uploadRingImage = uploadRingImage; // Expose to global scope


  function extractCode(input) {
    const match = input.match(/(\d+)/);
    return match ? match[1] : '';
  }
  window.extractCode = extractCode; // Expose if needed, but not strictly necessary as it's called internally

  function submitForm(event) {
    event.preventDefault();
    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.style.display = "flex";
    const codeInput = document.getElementById('number13').value;
    const extractedCode = extractCode(codeInput);
    if (!extractedCode) {
      alert('Invalid Code format. Please provide a valid code.');
      loadingOverlay.style.display = "none";
      return;
    }
    const formData = {
      title: extractedCode,
      english_description: document.getElementById('englishTextArea').value,
      persian_description: document.getElementById('arabicTextArea').value,
      image: `${extractedCode}.jpg`
    };
    const xhr = new XMLHttpRequest();
    /// github action (change)
    const url = 'https://api.github.com/repos/sarvari1378/SHOP_Creator/actions/workflows/Abbasi_Submit_Form.yml/dispatches';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', getToken());
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (window.uploadedRingImage) {
          const base64Content = window.uploadedRingImage.split(',')[1];
          window.uploadRingImage(extractedCode, base64Content);
        } else {
          alert('Workflow triggered successfully');
          loadingOverlay.style.display = "none";
          downloadImage();
        }
      } else {
        loadingOverlay.style.display = "none";
        const result = JSON.parse(xhr.responseText);
        alert(result.message ? result.message : 'An error occurred');
      }
    };
    xhr.onerror = function () {
      loadingOverlay.style.display = "none";
      alert('An error occurred during the workflow request.');
    };
    xhr.send(JSON.stringify({
      ref: 'main',
      inputs: formData
    }));
  }
  window.submitForm = submitForm; // Expose to global scope for onclick in HTML
});
