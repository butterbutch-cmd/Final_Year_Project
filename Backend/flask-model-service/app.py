from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import io

app = Flask(__name__)
CORS(app)  # Allow Express to call this

# Load once at startup
model = tf.keras.models.load_model("flower_model.keras")

with open("class_labels.json") as f:
    label_map = json.load(f)  # { "0": "azalea", "1": "rose", ... }

IMG_SIZE = (128,128)  # Must match what you trained with

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({ "error": "No image uploaded" }), 400

    file = request.files["image"]
    img_bytes = file.read()

    # Preprocess
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img) / 255.0          # Normalize same as training
    arr = np.expand_dims(arr, axis=0)    # Shape: (1, 224, 224, 3)

    # Predict
    predictions = model.predict(arr)
    predicted_index = int(np.argmax(predictions[0]))
    confidence = float(np.max(predictions[0]))
    label = label_map[str(predicted_index)]

    return jsonify({
        "label": label,
        "confidence": round(confidence * 100, 2),
        "index": predicted_index
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({ "status": "ok" })

if __name__ == "__main__":
    app.run(port=5001, debug=True)  # Express runs on 5000, Flask on 5001