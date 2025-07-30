# PDF-Pro 📄✨

[![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.0+-black?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![FAISS](https://img.shields.io/badge/FAISS-Vector%20DB-yellowgreen)](https://faiss.ai/)
[![LangChain](https://img.shields.io/badge/LangChain-RAG%20Pipeline-orange)](https://python.langchain.com/)

PDF-Pro is an intelligent document assistant that lets you chat with your PDFs! Upload documents and get instant answers powered by RAG (Retrieval-Augmented Generation) technology.

## 🌟 Features

- **PDF Upload & Processing**: Securely upload and process PDF documents
- **Context-Aware Q&A**: Ask natural language questions about document content
- **Fast Semantic Search**: FAISS-powered vector retrieval for relevant answers
- **Conversational Interface**: Chat-like interaction with document context
- **Dark/Light Mode**: Toggleable UI themes for comfortable reading
- **Drag & Drop**: Easy document uploading experience

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sakshamsetia/PDF-Pro.git
   cd pdf-pro
2. Create and activate a virtual environment
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    venv\Scripts\activate    # Windows
3. Install Dependencies
    ```bash
    pip install -r requirements.txt
4. Set up environment variables:
    ```bash
    echo "GEMINI_API_KEY=your_api_key_here" > .env
5. Run the application:
    ```bash
    flask run
6. Open Your Browser to:  ```http://localhost:5000```

