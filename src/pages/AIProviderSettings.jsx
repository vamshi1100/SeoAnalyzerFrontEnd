import { useCallback, useEffect, useState } from 'react';
import { getAIProviderConfig, saveAIProviderConfig } from '../services/aiProviderApi';
import './AIProviderSettings.css';

const EMPTY_FLAGS = { isGeminiAI: false, isClaude: false, isOllama: false };

function AIProviderSettings() {
  const [flags, setFlags] = useState(EMPTY_FLAGS);
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAIProviderConfig();
      setFlags(data.flags || EMPTY_FLAGS);
      setProviders(data.providers || null);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to load AI provider settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  function selectProvider(provider) {
    setNotice('');
    setFlags({
      isGeminiAI: provider === 'gemini',
      isClaude: provider === 'claude',
      isOllama: provider === 'ollama',
    });
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const result = await saveAIProviderConfig(flags);
      setFlags(result.flags);
      setNotice('AI provider settings saved. New audits will use this configuration.');
      await loadProviderStatusOnly();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to save AI provider settings.');
    } finally {
      setSaving(false);
    }
  }

  async function loadProviderStatusOnly() {
    try {
      const data = await getAIProviderConfig();
      setProviders(data.providers || null);
    } catch { /* Keep the saved state visible; status can be refreshed later. */ }
  }

  const selected = flags.isGeminiAI ? 'gemini' : flags.isClaude ? 'claude' : flags.isOllama ? 'ollama' : 'none';

  if (loading) return <main className="ai-settings-page"><div className="ai-settings-loading">Loading AI provider settings…</div></main>;

  return (
    <main className="ai-settings-page">
      <section className="ai-settings-heading">
        <div>
          <span className="ai-settings-eyebrow">CONFIGURATION</span>
          <h1>AI Provider Settings</h1>
          <p>Choose which AI provider is used for recommendations and semantic AEO/GEO assessment.</p>
        </div>
        <span className={`ai-settings-state ${selected === 'none' ? 'is-off' : 'is-on'}`}>
          <i /> {selected === 'none' ? 'AI suggestions disabled' : `${selected[0].toUpperCase()}${selected.slice(1)} selected`}
        </span>
      </section>

      {error && <div className="ai-settings-alert error" role="alert"><strong>Configuration error</strong><span>{error}</span></div>}
      {notice && <div className="ai-settings-alert success" role="status">{notice}</div>}

      <form className="ai-settings-panel" onSubmit={handleSave}>
        <div className="ai-settings-panel-title">
          <div><h2>Provider selection</h2><p>Only one provider can be active at a time.</p></div>
          <span className="single-provider-label">SINGLE PROVIDER MODE</span>
        </div>

        <div className="ai-provider-grid">
          <button type="button" className={`ai-provider-card ${selected === 'gemini' ? 'selected' : ''}`} onClick={() => selectProvider('gemini')}>
            <span className="provider-radio">{selected === 'gemini' && <i />}</span>
            <span className="provider-brand gemini-brand">G</span>
            <span className="provider-copy"><strong>Google Gemini</strong><small>Cloud AI · API key required</small></span>
            <span className="provider-availability">{providers?.gemini?.configured ? 'Configured' : 'Check API key'}</span>
            <span className="provider-description">Generate page-specific SEO fixes and semantic AEO/GEO assessments.</span>
          </button>

          <button type="button" className="ai-provider-card unavailable" disabled title="Claude integration is not included in this project version">
            <span className="provider-radio" />
            <span className="provider-brand claude-brand">C</span>
            <span className="provider-copy"><strong>Anthropic Claude</strong><small>Cloud AI · API key required</small></span>
            <span className="provider-availability coming-soon">Not integrated</span>
            <span className="provider-description">Claude provider adapter is not included in this uploaded project.</span>
          </button>

          <button type="button" className="ai-provider-card unavailable" disabled title="Ollama integration is not included in this project version">
            <span className="provider-radio" />
            <span className="provider-brand ollama-brand">O</span>
            <span className="provider-copy"><strong>Ollama</strong><small>Local AI · Local model required</small></span>
            <span className="provider-availability coming-soon">Not integrated</span>
            <span className="provider-description">Local model provider adapter is not included in this uploaded project.</span>
          </button>

          <button type="button" className={`ai-provider-card ai-provider-off ${selected === 'none' ? 'selected' : ''}`} onClick={() => selectProvider('none')}>
            <span className="provider-radio">{selected === 'none' && <i />}</span>
            <span className="provider-brand off-brand">—</span>
            <span className="provider-copy"><strong>Disable AI suggestions</strong><small>Rule-based audit only</small></span>
            <span className="provider-availability">Always available</span>
            <span className="provider-description">Run technical checks and structural AEO/GEO scoring without AI-generated recommendations.</span>
          </button>
        </div>

        <div className="ai-settings-note"><strong>API key security</strong><span>Provider credentials remain on the backend in <code>.env</code>. This page only updates provider flags; it never displays or sends API keys to the browser.</span></div>
        <div className="ai-settings-actions">
          <button type="button" className="settings-reset-btn" onClick={loadSettings} disabled={saving}>Discard changes</button>
          <button type="submit" className="settings-save-btn" disabled={saving}>{saving ? 'Saving…' : 'Save provider settings'}</button>
        </div>
      </form>

      <section className="ai-settings-info">
        <h2>How provider flags work</h2>
        <ul>
          <li><code>isGeminiAI</code> enables or disables Gemini execution.</li>
          <li><code>isClaude</code> and <code>isOllama</code> are reserved flags; their adapters must be implemented before activation.</li>
          <li>Changing settings affects subsequent audits; an audit already running keeps its current provider.</li>
          <li>If Gemini is disabled or unavailable, rule-based findings remain available and the report displays the AI status.</li>
        </ul>
      </section>
    </main>
  );
}

export default AIProviderSettings;
