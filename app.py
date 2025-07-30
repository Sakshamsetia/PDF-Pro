from flask import *
from retriever import chain
from faissing import faiss
from langchain_community.vectorstores import FAISS
import os
app = Flask(__name__)
vectordb : FAISS = None

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
    print("Started Faissing")
    vectordb = faiss()
    return jsonify({"message":"File Uploaded Successfully"})

@app.route('/chat',methods=['GET','POST'])
def chat():
    query = request.form.get('text')
    print(f"Asked Bot: {query}")
    response = chain(query,vectordb)
    return jsonify({"text":response})

if __name__ == "__main__":
    app.run(debug=True)