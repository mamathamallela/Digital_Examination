const questions = [
    {
      category: "English",
      questions: [
        {
          id: 1,
          question: "What is the synonym of 'eager'?",
          options: ["enthusiastic", "apathetic", "reluctant", "indifferent"],
          answer: "enthusiastic"
        },
        {
          id: 2,
          question: "Identify the correct sentence: 'She has been studying for hours.' or 'She have been studying for hours.'",
          options: ["She has been studying for hours.", "She have been studying for hours."],
          answer: "She has been studying for hours."
        },
        {
          id: 3,
          question: "What is the plural form of 'goose'?",
          options: ["geese", "gooses", "goose", "geeses"],
          answer: "geese"
        },
        {
          id: 4,
          question: "Choose the correct spelling: 'accommodate' or 'acommodate'.",
          options: ["accommodate", "acommodate"],
          answer: "accommodate"
        },
        {
          id: 5,
          question: "What is an antonym for 'persistent'?",
          options: ["fleeting", "temporary", "brief", "momentary"],
          answer: "fleeting"
        }
      ]
    },
    {
      category: "Mathematics",
      questions: [
        {
          id: 6,
          question: "What is the value of π (pi) to five decimal places?",
          options: ["3.14159", "3.14162", "3.14167", "3.14171"],
          answer: "3.14159"
        },
        {
          id: 7,
          question: "What is the result of 8 to the power of 3?",
          options: ["512", "64", "256", "729"],
          answer: "512"
        },
        {
          id: 8,
          question: "Solve the equation: 3x^2 + 5x - 2 = 0. (Give answers in decimal form)",
          options: ["x = 0.67 or x = -1", "x = 1 or x = -2", "x = 0.5 or x = -1.33", "x = 2 or x = -3"],
          answer: "x = 0.67 or x = -1"
        },
        {
          id: 9,
          question: "What is the value of the square root of 144?",
          options: ["12", "10", "8", "14"],
          answer: "12"
        },
        {
          id: 10,
          question: "What is the result of 9 factorial (9!)?",
          options: ["362880", "5040", "40320", "120"],
          answer: "362880"
        }
      ]
    },
    {
      category: "Logical Thinking",
      questions: [
        {
          id: 11,
          question: "If some roses fade quickly and all roses are flowers, can we conclude that some flowers fade quickly?",
          options: ["Yes", "No"],
          answer: "Yes"
      },
      {
          id: 12,
          question: "Complete the series: 2, 6, 12, 20, ____",
          options: ["30", "24", "36", "40"],
          answer: "30"
      },
      {
          id: 13,
          question: "Which of the following does not belong: apple, banana, orange, carrot?",
          options: ["banana", "orange", "carrot", "apple"],
          answer: "carrot"
      },
      {
          id: 14,
          question: "If A = 1, B = 2, C = 3, what does D + E equal?",
          options: ["6", "7", "8", "9"],
          answer: "9"
      },
      {
          id: 15,
          question: "If a shirt costs $20 without a discount, and is 25% off, how much does it cost with the discount?",
          options: ["$15", "$16", "$18", "$22"],
          answer: "$15"
      }
      ]
    },
    {
      category: "Python",
      questions: [
        {
          id: 16,
          question: "What does the 'print' function do in Python?",
          options: ["Displays output on the console", "Prompts the user for input", "Creates a new file", "Performs a mathematical operation"],
          answer: "Displays output on the console"
        },
        {
          id: 17,
          question: "What is the result of 5 divided by 2 in Python?",
          options: ["2.5", "2", "2.0", "2.25"],
          answer: "2.5"
        },
        {
          id: 18,
          question: "Which of the following data types is immutable in Python?",
          options: ["List", "Tuple", "Dictionary", "Set"],
          answer: "Tuple"
        },
        {
          id: 19,
          question: "What is the purpose of the 'len()' function in Python?",
          options: ["Returns the length of a list or string", "Converts a string to lowercase", "Generates a random number", "Finds the square root of a number"],
          answer: "Returns the length of a list or string"
        },
        {
          id: 20,
          question: "What is the result of '3 + 2 * 2' in Python?",
          options: ["7", "10", "8", "12"],
          answer: "7"
        },
        {
          id: 21,
          question: "Which keyword is used for defining a function in Python?",
          options: ["def", "function", "define", "func"],
          answer: "def"
        },
        {
          id: 22,
          question: "What is the output of 'print(type(5))' in Python?",
          options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"],
          answer: "<class 'int'>"
        },
        {
          id: 23,
          question: "Which of the following is a valid Python variable name: 'my_variable', '2nd_variable', 'variable@3', 'my-variable'?",
          options: ["my_variable", "2nd_variable", "variable@3", "my-variable"],
          answer: "my_variable"
        },
        {
          id: 24,
          question: "What is the result of '2 ** 3' in Python?",
          options: ["8", "6", "5", "16"],
          answer: "8"
        },
        {
          id: 25,
          question: "What does 'num_list[-1]' access in a Python list?",
          options: ["The last element", "The first element", "An element at index 1", "An element at index -1"],
          answer: "The last element"
        }
      ]
    }
  ];
  
  export default questions;