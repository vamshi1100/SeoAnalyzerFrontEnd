
import { useState } from "react";
import { useSelector } from "react-redux";
import "./AuditResults.css";

function ScoreCard({ title, score }) {
    return (
        <div className="score-card">
            <h3>{title}</h3>

            <div
                className="score-circle"
                style={{
                    background: `conic-gradient(#2563eb ${score * 3.6}deg, #e5e7eb 0deg)`,
                }}
            >
                <div className="score-inner">
                    <strong>{score}</strong>
                    <span>/ 100</span>
                </div>
            </div>

            <p>
                {score >= 80
                    ? "Good"
                    : score >= 60
                        ? "Needs improvement"
                        : "Needs attention"}
            </p>
        </div>
    );
}

function Accordion({ id, title, count, openId, setOpenId, children }) {
    const isOpen = openId === id;

    return (
        <div className={`accordion ${isOpen ? "active" : ""}`}>
            <button
                type="button"
                className="accordion-header"
                onClick={() => setOpenId(isOpen ? null : id)}
                aria-expanded={isOpen}
            >
                <span>
                    {title}
                    {count !== undefined && (
                        <span className="accordion-count">{count}</span>
                    )}
                </span>

                <span className={`accordion-arrow ${isOpen ? "rotate" : ""}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="accordion-content">
                    {children}
                </div>
            )}
        </div>
    );
}

function AuditResults() {
    const { auditData, loading, error } = useSelector(
        (state) => state.audit
    );

    // One shared state controls every accordion
    const [openAccordion, setOpenAccordion] = useState(null);

    if (loading) return <h2>Analyzing website...</h2>;
    if (error) return <h2>Error: {error}</h2>;
    if (!auditData) return <h2>No audit results available.</h2>;

    const report = auditData?.data?.audit;

    if (!report) {
        return <h2>Audit data not found in API response.</h2>;
    }

    const scores = report.scores || {};
    const issues = Array.isArray(report.issues) ? report.issues : [];
    const summary = report.summary || {};
    const aiCoverage = report.ai_recommendation_coverage || {};

    const categories = ["SEO", "AEO", "GEO"];

    const getAIRecommendation = (issue) => {
        return (
            issue.ai_recommendation ||
            issue["ai suggestion fix"] ||
            issue.ai_suggestion_fix ||
            null
        );
    };

    const getAffectedElement = (issue) => {
        return (
            issue.affected_element ||
            issue["actual elemet on which fix has to be made"] ||
            issue.implementation_location ||
            null
        );
    };

    const getPriorityClass = (priority) => {
        return priority?.toLowerCase() || "unknown";
    };

    return (
        <div className="audit-results">

            {/* REPORT HEADER - UNCHANGED */}
            <div className="report-header">
                <div>
                    <h1>Website Audit Results</h1>
                    <p>{report.url}</p>
                </div>

                <div className="overall-score">
                    <span>Overall Score</span>
                    <strong>{scores.overall ?? 0}/100</strong>
                </div>
            </div>

            {/* SCORE CARDS - UNCHANGED */}
            <section className="score-grid">
                <ScoreCard title="SEO Score" score={scores.seo ?? 0} />
                <ScoreCard title="AEO Score" score={scores.aeo ?? 0} />
                <ScoreCard title="GEO Score" score={scores.geo ?? 0} />
            </section>

            {/* SUMMARY - UNCHANGED */}
            <section className="summary-section">
                <h2>Audit Summary</h2>

                <div className="summary-grid">
                    <div className="summary-card">
                        <span>Total Issues</span>
                        <strong>{issues.length}</strong>
                    </div>

                    <div className="summary-card">
                        <span>Passed Checks</span>
                        <strong>{summary.passed_checks ?? 0}</strong>
                    </div>

                    <div className="summary-card">
                        <span>Total Checks</span>
                        <strong>{summary.total_checks ?? 0}</strong>
                    </div>

                    <div className="summary-card">
                        <span>Confidence</span>
                        <strong>{report.confidence ?? 0}%</strong>
                    </div>
                </div>
            </section>

            {/* QUICK WINS - ACCORDION */}
            {report.quick_wins?.length > 0 && (
                <section className="quick-wins">
                    <Accordion
                        id="quick-wins"
                        title="Quick Wins"
                        count={report.quick_wins.length}
                        openId={openAccordion}
                        setOpenId={setOpenAccordion}
                    >
                        {report.quick_wins.map((item, index) => (
                            <div className="quick-win-card" key={item.issue_id || index}>
                                <h3>{item.rank}. {item.title}</h3>
                                <p>{item.fix}</p>
                                <span>
                                    Effort: {item.estimated_effort} | Impact: {item.expected_impact}
                                </span>
                            </div>
                        ))}
                    </Accordion>
                </section>
            )}

            {/* ALL ISSUES - ACCORDIONS */}
            <section className="issues-section">
                <h2>All Audit Issues ({issues.length})</h2>

                {categories.map((category) => {
                    const categoryIssues = issues.filter(
                        (issue) =>
                            issue.category?.toUpperCase() === category
                    );

                    return (
                        <Accordion
                            key={category}
                            id={category}
                            title={`${category} Issues`}
                            count={categoryIssues.length}
                            openId={openAccordion}
                            setOpenId={setOpenAccordion}
                        >
                            {categoryIssues.length === 0 ? (
                                <p>No issues found in this category.</p>
                            ) : (
                                categoryIssues.map((issue, index) => {
                                    const aiRecommendation = getAIRecommendation(issue);
                                    const affectedElement = getAffectedElement(issue);

                                    return (
                                        <article
                                            className="issue-card"
                                            key={issue.issue_id || index}
                                        >
                                            <div className="issue-header">
                                                <h3>{issue.title}</h3>

                                                <div className="issue-badges">
                                                    <span
                                                        className={`priority-badge ${getPriorityClass(
                                                            issue.priority
                                                        )}`}
                                                    >
                                                        {issue.priority}
                                                    </span>

                                                    <span className="severity-badge">
                                                        {issue.severity}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="issue-details">

                                                <div>
                                                    <h4>Problem / Evidence</h4>
                                                    <p>
                                                        {issue.evidence ||
                                                            issue.problem ||
                                                            "No evidence available."}
                                                    </p>
                                                </div>

                                                {issue.actual_value && (
                                                    <div>
                                                        <h4>Actual Value</h4>
                                                        <p>{issue.actual_value}</p>
                                                    </div>
                                                )}

                                                {issue.expected_value && (
                                                    <div>
                                                        <h4>Expected Value</h4>
                                                        <p>{issue.expected_value}</p>
                                                    </div>
                                                )}

                                                {issue.why_it_matters && (
                                                    <div>
                                                        <h4>Why It Matters</h4>
                                                        <p>{issue.why_it_matters}</p>
                                                    </div>
                                                )}

                                                <div className="fix-box">
                                                    <h4>Recommended Fix</h4>
                                                    <p>
                                                        {issue.fix ||
                                                            issue.recommendation ||
                                                            "No fix available."}
                                                    </p>
                                                </div>

                                                <div className="ai-box">
                                                    <h4>AI Recommendation</h4>

                                                    {aiRecommendation ? (
                                                        <p>
                                                            {typeof aiRecommendation === "string"
                                                                ? aiRecommendation
                                                                : JSON.stringify(aiRecommendation, null, 2)}
                                                        </p>
                                                    ) : (
                                                        <p>
                                                            AI recommendation is not available for this
                                                            issue. Follow the rule-based fix above.
                                                        </p>
                                                    )}
                                                </div>

                                                {affectedElement && (
                                                    <div>
                                                        <h4>
                                                            Affected Element / Implementation Location
                                                        </h4>

                                                        {Array.isArray(affectedElement) ? (
                                                            <ul>
                                                                {affectedElement.map((element, i) => (
                                                                    <li key={i}>
                                                                        <code>{element}</code>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="element-text">
                                                                {affectedElement}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="issue-footer">
                                                    <span>
                                                        Effort: {issue.estimated_effort || "Not specified"}
                                                    </span>

                                                    <span>
                                                        Expected Impact: {issue.expected_impact || "Not specified"}
                                                    </span>
                                                </div>

                                            </div>
                                        </article>
                                    );
                                })
                            )}
                        </Accordion>
                    );
                })}
            </section>

            {/* AI STATUS - ACCORDION */}
            <section className="ai-status">
                <Accordion
                    id="ai-status"
                    title="AI Recommendation Status"
                    openId={openAccordion}
                    setOpenId={setOpenAccordion}
                >
                    <p>
                        Issues analyzed: {aiCoverage.issues_analyzed ?? 0}
                    </p>

                    <p>
                        Recommendations generated:{" "}
                        {aiCoverage.recommendations_generated ?? 0}
                    </p>

                    <p>
                        AI mode: {aiCoverage.mode || "Unavailable"}
                    </p>

                    {auditData.error && (
                        <p className="ai-error">
                            {auditData.error}
                        </p>
                    )}
                </Accordion>
            </section>

            {/* LIMITATIONS - ACCORDION */}
            {report.limitations?.length > 0 && (
                <section className="limitations">
                    <Accordion
                        id="limitations"
                        title="Audit Limitations"
                        count={report.limitations.length}
                        openId={openAccordion}
                        setOpenId={setOpenAccordion}
                    >
                        <ul>
                            {report.limitations.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </Accordion>
                </section>
            )}

        </div>
    );
}

export default AuditResults;
