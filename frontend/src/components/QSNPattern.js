import React, { Component } from 'react';
import './QSNPattern.css'; // Importing CSS file for styling

class QSNPattern extends Component {
  constructor() {
    super();
    this.state = {
      patterns: [
        {
          src: 'https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FMultipleChoice.svg&w=128&q=75',
          alt: 'Multiple Choice Questions'
        },
        {
          src: 'https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FShortAnswer.svg&w=128&q=75',
          alt: 'Short Answer Type Ques tion'
        },
        {
          src: 'https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FLongAnswerType.svg&w=128&q=75',
          alt: 'Long Answer Type Questions'
        },
        {
          src: 'https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FDiagramType.svg&w=128&q=75',
          alt: 'Diagram Type Question'
        },
        {
          src: 'https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FCaseStudy.svg&w=128&q=75',
          alt: 'Case Study Question'
        },
        {
          src: 'https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FCodingQuestions.svg&w=128&q=75',
          alt: 'Coding Questions'
        },
        {
          src:"https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FFillInTheBlanks.svg&w=128&q=75",
          alt: 'Fill in the Blank Questions'
        },
        {
          src:"https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FUploadResponses.svg&w=128&q=75",
          alt: 'Upload Files as Responses'
        },
      ]
    };
  }

  render() {
    return (
      <div className="pattern-container">
        <div className='pattern-header'>
            <img src='https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FMathsFormula.png&w=256&q=75' alt='img'/>
        <p >Support for Complex Mathematical and Chemical Equations</p>
        <img src='https://assetsprelogin.mettl.com/_next/image/?url=%2Fassets%2Fonscreen-digital-evaluation-system%2FEquation2.png&w=256&q=75' alt='img'/>
        <p >Support for Complex Scientific Diagrams</p>
        

        </div>
        <h4>We Support the Following Question Types and Many More</h4>
        
        <div className="pattern-grid">
        
          {this.state.patterns.map((pattern, index) => (
            <div key={index} className="pattern">
              <div className="pattern-content">
                <img src={pattern.src} alt={pattern.alt} />
                <span>{pattern.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default QSNPattern;
