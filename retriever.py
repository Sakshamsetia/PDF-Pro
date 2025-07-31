from model import ChatModel
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda,RunnableMap,RunnablePassthrough
from faissing import faiss
import re

def chain(message, vectordb: FAISS = None, history: list = []):
    prompt_template = PromptTemplate.from_template("""
    context:{context}
    question:{question}
    history:{history}
    """)
    llm = ChatModel()
    
    def contextualize_query(current_question):
        # Get last 2-3 user messages
        last_msgs = " ".join([h['text'] for h in history[-5:] if h['role'] == 'user'])
        
        # If current question is very short or missing nouns, add keywords
        candidates = re.findall(r'\b[A-Z][a-zA-Z]+|\b[a-z]{4,}\b', last_msgs)
        keywords = " ".join(set(candidates))
        if keywords and keywords.lower() not in current_question.lower():
            return f"{current_question} (related to {keywords})"
        return current_question

    def getData(query):
        if not vectordb: 
            return ""
        sol = vectordb.similarity_search(query=(contextualize_query(query["question"])))
        context = """"""
        for page in sol:
            context += page.page_content+"\n\n"
        return context
    
    context = ""
    for h in history:
        context += f"{h['role']} : {h['text']}" 
        
    chain = RunnableMap({
        "question":RunnablePassthrough(),
        "context":RunnableLambda(getData),
        "history": lambda _: context
    }) | prompt_template | llm | StrOutputParser()
    
    return chain.invoke({"question":message})

if __name__=="__main__":
    vectordb = faiss()
    print(chain(input(),vectordb,[]))