from flask import *
from retriever import chain
from faissing import faiss

app = Flask(__name__)

@app.route('/')
def start():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)