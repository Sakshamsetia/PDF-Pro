from langchain_core.language_models import BaseChatModel
import google.genai as genai
from langchain_core.messages import AIMessage
from langchain_core.prompt_values import StringPromptValue
from dotenv import load_dotenv
import os
from google.genai import types

class ChatModel(BaseChatModel):
    def __init__(self):
        load_dotenv(override=True)
        api_key = os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)
        object.__setattr__(self,"client",client)
        sysPrompt = types.GenerateContentConfig(
            temperature=0.45, 
            system_instruction = """
First try to answer based on the uploaded PDF.
If no relevant information is found or no context is given in prompt, you may use general knowledge to help.
Be transparent if you're going beyond the document.
"""
        )
        object.__setattr__(self,"sysPrompt",sysPrompt)
        
    
    def _generate(self, messages:str)->str:
        response = self.client.models.generate_content(
            contents=messages,
            model='gemini-2.0-flash',
            config=self.sysPrompt
        )
        return response.text
    
    def invoke(self, input:StringPromptValue, config = None)->AIMessage:
        msg = input.to_string()
        response = self._generate(msg)
        return AIMessage(content=response)
                
    @property
    def streaming(self):
        return False
    
    @property
    def _llm_type(self):
        return "Custom_gemini"
    
    @property
    def callback(self):
        return []