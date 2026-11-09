
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAudit } from "../redux/auditSlice";
import "./WebsiteAudit.css";

const auditSteps = [
    {
        title: "Connecting to website",
        description: "Validating URL and establishing connection"
    },
    {
        title: "Crawling website",
        description: "Extracting HTML, headings, links and metadata"
    },
    {
        title: "SEO Analysis",
        description: "Checking technical and on-page SEO"
    },
    {
        title: "AEO & GEO Analysis",
        description: "Evaluating answer and generative engine readiness"
    },
    {
        title: "AI Recommendations",
        description: "Generating intelligent improvement suggestions"
    },
    {
        title: "Preparing Report",
        description: "Organizing scores, findings and recommendations"
    }
];

function WebsiteAudit() {
    const [url, setUrl] = useState(
        "https://www.srimandir.com/epuja"
    );

    const [currentStep, setCurrentStep] = useState(-1);
    const [showLoader, setShowLoader] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.audit
    );

    useEffect(() => {
        if (!loading || !showLoader) return;

        const timers = auditSteps.map((_, index) =>
            setTimeout(() => {
                setCurrentStep(index);
            }, index * 5000)
        );

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [loading, showLoader]);

    const handleAudit = async () => {
        if (!url.trim()) return;

        setCurrentStep(0);
        setShowLoader(true);

        try {
            await dispatch(fetchAudit(url)).unwrap();

            setCurrentStep(auditSteps.length);

            navigate("/results");

        } catch (err) {
            console.error("Audit failed:", err);
        } finally {
            setShowLoader(false);
        }
    };

    const completedSteps = Math.max(
        0,
        Math.min(currentStep, auditSteps.length)
    );

    const progress = loading
        ? Math.min(
            95,
            Math.round(
                (completedSteps / auditSteps.length) * 100
            )
        )
        : 0;

    return (
        <div className="website-audit-page">

            <div className="audit-container">

                <div className="audit-heading">
                    <span className="audit-tag">
                        WEBSITE INTELLIGENCE
                    </span>

                    <h1>Analyze Your Website</h1>

                    <p>
                        Discover SEO, AEO and GEO opportunities
                        with a comprehensive website audit.
                    </p>
                </div>

                <div className="audit-input-card">

                    <label htmlFor="website-url">
                        Website URL
                    </label>

                    <div className="audit-input-wrapper">
                        <span className="url-icon">↗</span>

                        <input
                            id="website-url"
                            type="url"
                            value={url}
                            onChange={(e) =>
                                setUrl(e.target.value)
                            }
                            placeholder="https://example.com"
                            disabled={loading}
                        />

                        <button
                            onClick={handleAudit}
                            disabled={loading || !url.trim()}
                        >
                            {loading
                                ? "Analyzing..."
                                : "Analyze Website →"}
                        </button>
                    </div>

                    <small>
                        Enter the URL of the page you want to analyze.
                    </small>
                </div>

                {loading && (
                    <div className="audit-progress-card">

                        <div className="progress-header">
                            <div>
                                <span className="progress-tag">
                                    AUDIT IN PROGRESS
                                </span>

                                <h2>Analyzing your website</h2>

                                <p>
                                    Please wait while we inspect your website.
                                </p>
                            </div>

                            <div className="progress-percentage">
                                {progress}%
                            </div>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${progress}%`
                                }}
                            />
                        </div>

                        <div className="audit-steps">

                            {auditSteps.map((step, index) => {
                                const completed =
                                    index < completedSteps;

                                const active =
                                    index === currentStep;

                                return (
                                    <div
                                        className={`audit-step ${completed
                                                ? "completed"
                                                : active
                                                    ? "active"
                                                    : ""
                                            }`}
                                        key={step.title}
                                    >
                                        <div className="step-icon">
                                            {completed ? (
                                                "✓"
                                            ) : active ? (
                                                <span className="step-spinner" />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>

                                        <div className="step-content">
                                            <h4>{step.title}</h4>
                                            <p>{step.description}</p>
                                        </div>

                                        <div className="step-status">
                                            {completed
                                                ? "Completed"
                                                : active
                                                    ? "In progress"
                                                    : "Pending"}
                                        </div>
                                    </div>
                                );
                            })}

                        </div>

                        <div className="progress-note">
                            <span className="pulse-dot" />
                            Processing your website audit...
                        </div>

                    </div>
                )}

                {!loading && error && (
                    <div className="audit-error">
                        <div className="error-icon">!</div>

                        <div>
                            <h3>Audit Failed</h3>
                            <p>{String(error)}</p>
                            <button onClick={handleAudit}>
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}

export default WebsiteAudit;
