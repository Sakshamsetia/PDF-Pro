from flask import *
from retriever import chain
from faissing import faiss
from langchain_community.vectorstores import FAISS
import os
app = Flask(__name__)
vectordb : FAISS

@app.route('/')
def start():
    return render_template('index.html')

@app.route('/files',methods=['POST','GET'])
def upload():
    if 'file' not in request.files:
        return jsonify({"message": "No file uploaded"}), 400
    file = request.files['file']
    os.makedirs("PDFs", exist_ok=True)
    file.save(os.path.join("PDFs","test.pdf"))
    vectordb = faiss()
    return jsonify({"message":"File Uploaded Successfully"})

if __name__ == "__main__":
    app.run(debug=True)