from langchain.document_loaders import PyPDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


def faiss():
    pdf = PyPDFLoader('./PDFs/test.pdf')
    data = pdf.load()
    model = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
    
    vectorDb = FAISS.from_documents(documents=data,embedding=model)
    return vectorDb

if __name__=="__main__":
    print("Hello World")