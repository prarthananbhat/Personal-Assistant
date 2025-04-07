import os
from dotenv import load_dotenv
from google import generativeai
import math


load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
generativeai.configure(api_key=api_key)
model = generativeai.GenerativeModel('gemini-2.0-flash')


def string_to_number(string):
    return [ord(char) for char in string]

def int_list_to_exponential_sum(int_list):
    int_list = eval(int_list)
    return sum([math.exp(num) for num in int_list])

def fibonacci_numbers(n):
    return [0, 1] + [fibonacci_numbers(n-1)[i-1] + fibonacci_numbers(n-1)[i-2] for i in range(2, n)]    

def function_call(function_name, params):
    """Simple function caller maps function names to actual functions"""

    function_map = {
        'string_to_number': string_to_number,
        'int_list_to_exponential_sum': int_list_to_exponential_sum,
        'fibonacci_numbers': fibonacci_numbers
    }

    if function_name not in function_map:
        raise ValueError(f"Function {function_name} not found in function map")
    else:
        return function_map[function_name](params)


max_iteration = 3
current_query = None
iter_call = 0

system_prompt = """You are a math agent, Respond with exactly one of these formats:
1. FUNCTION_CALL: python_function_name|input
2. FINAL_RESULT: [number]

where python_function_name(input) is the name of one of the following functions:
1. string_to_number(string) It takes a string and return s the ASCII values of the characters in the string
2. int_list_to_exponential_sum(int_list) It takes a list of integers and returns the sum of the exponentials of the integers
3. fibonacci_numbers(n) It takes an integer n and returns the first n Fibonacci numbers

DO NOT unclude multiple responses
Give ONE responses at a time

"""
current_query = """calculate the sum of exponentials of the word TSAI"""

while(iter_call < max_iteration):
    print(f'\n\nIteration:{iter_call}')

    if iter_call == 0:
        prompt = "\n".join([system_prompt, f'Query:{current_query}'])

        # prompt = f'{system_prompt}\nQuery:{current_query}'
    else:
        iteration_prompt = f'In the previous iteration {iter_call} you called the function {func_name} with {parameters} parameters, and the function returned {iteration_result}, what should I do next?'
        # prompt = f'{system_prompt}\n\nQuery:{current_query}\n\n{iteration_prompt}'
        # prompt = f'{system_prompt}\n\nQuery:{current_query}\n\n{iteration_prompt}'
        prompt = "\n".join([prompt, iteration_prompt])
    
    # print(f'\n\n{prompt}')

    response = model.generate_content(prompt)
    
    if "FUNCTION_CALL" in response.text:
        function_info = response.text.strip().split(':',1)
        func_name, parameters = [x.strip() for x in function_info[1].split('|',1)]
        print(f'\nResponse:{response.text}')
        print(f'Function Name:{func_name}')
        print(f'Parameters:{parameters}')
        iteration_result = function_call(func_name, parameters)
        print(f'Iteration Result:{iteration_result}')
    elif "FINAL_RESULT" in response.text:
        print(f'\nResponse:{response.text}')
        break
    
    iter_call += 1

