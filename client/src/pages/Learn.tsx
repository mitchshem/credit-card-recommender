import React, { useState } from 'react';

const Learn: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('basics');

  const topics = {
    basics: {
      title: "Credit Card Basics",
      lessons: [
        "Understanding Credit Scores",
        "How Credit Cards Work",
        "Annual Fees vs Benefits",
        "Interest Rates and APR",
        "Credit Utilization"
      ]
    },
    rewards: {
      title: "Rewards & Points",
      lessons: [
        "Types of Reward Programs",
        "Maximizing Point Values",
        "Transfer Partners",
        "Redemption Strategies",
        "Point Valuations"
      ]
    },
    strategy: {
      title: "Advanced Strategies",
      lessons: [
        "Credit Card Churning",
        "Manufactured Spending",
        "Category Optimization",
        "Annual Fee Justification",
        "Portfolio Management"
      ]
    },
    travel: {
      title: "Travel Rewards",
      lessons: [
        "Airline Miles vs Hotel Points",
        "Elite Status Benefits",
        "Lounge Access Guide",
        "Travel Insurance Coverage",
        "International Usage"
      ]
    }
  };

  const glossaryTerms = [
    { term: "APR", definition: "Annual Percentage Rate - the yearly interest rate charged on outstanding balances" },
    { term: "Churning", definition: "Opening credit cards for signup bonuses and then closing or downgrading them" },
    { term: "MSR", definition: "Minimum Spend Requirement - spending needed to earn a signup bonus" },
    { term: "Transfer Partners", definition: "Airlines and hotels where you can transfer points for potentially higher value" },
    { term: "5/24 Rule", definition: "Chase's policy of not approving applicants with 5+ new cards in 24 months" }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Learn</h1>
        <p>Master credit cards, points, and rewards with our comprehensive guides</p>
      </div>

      <div className="learn-sections">
        <div className="topics-section">
          <h3>📖 Learning Topics</h3>
          <div className="topics-nav">
            {Object.entries(topics).map(([key, topic]) => (
              <button
                key={key}
                className={`topic-btn ${selectedTopic === key ? 'active' : ''}`}
                onClick={() => setSelectedTopic(key)}
              >
                {topic.title}
              </button>
            ))}
          </div>

          <div className="topic-content">
            <div className="card">
              <h4>{topics[selectedTopic as keyof typeof topics].title}</h4>
              <div className="lessons-list">
                {topics[selectedTopic as keyof typeof topics].lessons.map((lesson, index) => (
                  <div key={index} className="lesson-item">
                    <span className="lesson-number">{index + 1}</span>
                    <span className="lesson-title">{lesson}</span>
                    <span className="lesson-status">Coming Soon</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glossary-section">
          <h3>📝 Glossary</h3>
          <div className="card">
            <div className="glossary-list">
              {glossaryTerms.map((item, index) => (
                <div key={index} className="glossary-item">
                  <dt className="glossary-term">{item.term}</dt>
                  <dd className="glossary-definition">{item.definition}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="resources-section">
          <h3>🔗 Helpful Resources</h3>
          <div className="resources-grid">
            <div className="card resource-card">
              <h4>📊 Credit Monitoring</h4>
              <p>Track your credit score and get alerts for changes</p>
              <ul>
                <li>Credit Karma</li>
                <li>Experian</li>
                <li>Chase Credit Journey</li>
              </ul>
            </div>

            <div className="card resource-card">
              <h4>✈️ Travel Planning</h4>
              <p>Tools for maximizing travel rewards</p>
              <ul>
                <li>Award booking engines</li>
                <li>Route planning tools</li>
                <li>Hotel comparison sites</li>
              </ul>
            </div>

            <div className="card resource-card">
              <h4>💰 Spending Tracking</h4>
              <p>Monitor your spending across categories</p>
              <ul>
                <li>Mint</li>
                <li>YNAB</li>
                <li>Personal Capital</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="quiz-section">
          <h3>🧠 Knowledge Check</h3>
          <div className="card">
            <h4>Quick Quiz</h4>
            <p>Test your credit card knowledge with our interactive quizzes</p>
            <div className="quiz-topics">
              <button className="quiz-btn">Basics Quiz (10 questions)</button>
              <button className="quiz-btn">Rewards Quiz (15 questions)</button>
              <button className="quiz-btn">Advanced Quiz (20 questions)</button>
            </div>
            <p className="placeholder-text"><em>Interactive quizzes coming soon</em></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
