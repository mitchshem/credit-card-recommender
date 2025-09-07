import React, { useState } from 'react';

interface RefreshStatus {
  isRunning: boolean;
  lastUpdate: string | null;
  totalCards: number;
  status: 'idle' | 'running' | 'success' | 'error';
  message: string;
}

const ScraperRefresh: React.FC = () => {
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>({
    isRunning: false,
    lastUpdate: localStorage.getItem('lastScraperUpdate'),
    totalCards: 0,
    status: 'idle',
    message: ''
  });

  const triggerRefresh = async () => {
    setRefreshStatus(prev => ({
      ...prev,
      isRunning: true,
      status: 'running',
      message: 'Starting card database refresh...'
    }));

    try {
      const response = await fetch('/api/refresh-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const now = new Date().toISOString();
        
        localStorage.setItem('lastScraperUpdate', now);
        
        setRefreshStatus({
          isRunning: false,
          lastUpdate: now,
          totalCards: result.totalCards || 0,
          status: 'success',
          message: `Successfully updated ${result.totalCards} cards`
        });
      } else {
        throw new Error('Refresh failed');
      }
    } catch (error) {
      setRefreshStatus(prev => ({
        ...prev,
        isRunning: false,
        status: 'error',
        message: 'Failed to refresh card database. Please try again later.'
      }));
    }
  };

  const formatLastUpdate = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  return (
    <div className="scraper-refresh-widget">
      <div className="refresh-header">
        <h4>🔄 Card Database</h4>
        <div className="refresh-status">
          <span className={`status-indicator ${refreshStatus.status}`}>
            {refreshStatus.status === 'running' && '⏳'}
            {refreshStatus.status === 'success' && '✅'}
            {refreshStatus.status === 'error' && '❌'}
            {refreshStatus.status === 'idle' && '💤'}
          </span>
        </div>
      </div>

      <div className="refresh-info">
        <p className="last-update">
          <strong>Last Update:</strong> {formatLastUpdate(refreshStatus.lastUpdate)}
        </p>
        
        {refreshStatus.totalCards > 0 && (
          <p className="card-count">
            <strong>Total Cards:</strong> {refreshStatus.totalCards}
          </p>
        )}

        {refreshStatus.message && (
          <p className={`refresh-message ${refreshStatus.status}`}>
            {refreshStatus.message}
          </p>
        )}
      </div>

      <div className="refresh-actions">
        <button
          onClick={triggerRefresh}
          disabled={refreshStatus.isRunning}
          className={`btn-refresh ${refreshStatus.isRunning ? 'loading' : ''}`}
        >
          {refreshStatus.isRunning ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>

      <div className="refresh-schedule">
        <p className="schedule-info">
          <small>Automatic refresh: Daily at 2:00 AM</small>
        </p>
      </div>
    </div>
  );
};

export default ScraperRefresh;
