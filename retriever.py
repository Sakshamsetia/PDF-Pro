from model import ChatModel
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda,RunnableMap,RunnablePassthrough
from faissing import faiss

def chain(message,vectordb: FAISS):
    prompt_template = PromptTemplate.from_template("""
    context:{context}
    question:{question}                                               
    """)
    llm = ChatModel()
    def getData(query):
        if not vectordb: 
            return ""
        sol = vectordb.similarity_search(query=query["question"],k=5)
        context = """"""
        for page in sol:
            context += page.page_content+"\n\n"
        return context
    
    chain = RunnableMap({
        "question":RunnablePassthrough(),
        "context":RunnableLambda(getData)
    }) | prompt_template | llm | StrOutputParser()
    
    return chain.invoke({"question":message})

if __name__=="__main__":
    vectordb = faiss()
    print(chain(input(),vectordb))