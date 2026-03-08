'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export default function ChallengePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const challengeId = params.id as string;
  const isResults = searchParams.get('results') === 'true';
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!challengeId) {
      setLoading(false);
      return;
    }
    fetch(`https://songmatch-backend-production.up.railway.app/api/challenges/${challengeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setChallenge(data.challenge);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [challengeId]);

  const bgStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(180deg, #1E0050 0%, #101B3B 60%, #081C2E 100%)',
    color: 'white',
  };

  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: '#00FFE6',
    marginBottom: '32px',
    letterSpacing: '3px',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(12,20,38,0.9)',
    border: '1px solid #00FFF0',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
  };

  const goldCardStyle: React.CSSProperties = {
    ...cardStyle,
    border: '1px solid #FFD700',
  };

  const primaryButtonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '16px 24px',
    borderRadius: '50px',
    fontSize: '17px',
    fontWeight: 600,
    background: '#00FFE6',
    color: '#0D1B2A',
    marginBottom: '16px',
    textDecoration: 'none',
    textAlign: 'center',
  };

  const outlineButtonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '16px 24px',
    borderRadius: '50px',
    fontSize: '17px',
    fontWeight: 600,
    background: 'transparent',
    color: '#00FFE6',
    border: '2px solid #00FFE6',
    textDecoration: 'none',
    textAlign: 'center',
    marginBottom: '16px',
  };

  const spotifyButtonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '14px 24px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: 600,
    background: '#1DB954',
    color: 'white',
    textDecoration: 'none',
    textAlign: 'center',
    marginBottom: '12px',
    cursor: 'pointer',
  };

  if (loading) {
    return (
      <div style={bgStyle}>
        <div style={containerStyle}>
          <div style={logoStyle}>♪ SONGMATCH</div>
          <p style={{ color: '#A3DFFF', fontSize: '18px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div style={bgStyle}>
        <div style={containerStyle}>
          <div style={logoStyle}>♪ SONGMATCH</div>
          <p style={{ color: '#FF6B6B', fontSize: '16px' }}>Challenge not found</p>
        </div>
      </div>
    );
  }

  // Results view
  if (isResults && challenge.winner) {
    const winnerName = challenge.winner === 'challenger'
      ? challenge.challenger_display_name
      : challenge.responder_display_name;
    const loserName = challenge.winner === 'challenger'
      ? challenge.responder_display_name
      : challenge.challenger_display_name;
    const winnerScore = parseFloat(challenge.winner === 'challenger'
      ? challenge.challenger_score
      : challenge.responder_score).toFixed(2);
    const loserScore = parseFloat(challenge.winner === 'challenger'
      ? challenge.responder_score
      : challenge.challenger_score).toFixed(2);
    const margin = Math.abs(parseFloat(winnerScore) - parseFloat(loserScore)).toFixed(2);
    const winningSong = challenge.winning_song;
    const hasSpotifyId = winningSong?.spotify_id && !winningSong.spotify_id.includes('fallback');

    return (
      <div style={bgStyle}>
        <div style={containerStyle}>
          <div style={logoStyle}>♪ SONGMATCH</div>

          {/* Winner Banner */}
          <div style={goldCardStyle}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏆</div>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#FFD700', marginBottom: '4px' }}>
              {winnerName} WINS!
            </p>
            <p style={{ fontSize: '15px', color: '#A3DFFF', marginBottom: '20px' }}>
              Defeated {loserName} by {margin} points
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#FFD700' }}>{winnerScore}</div>
                <div style={{ fontSize: '11px', color: '#A3DFFF', marginTop: '4px' }}>{winnerName}</div>
              </div>
              <div style={{ fontSize: '20px', color: '#A3DFFF', alignSelf: 'center' }}>vs</div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>{loserScore}</div>
                <div style={{ fontSize: '11px', color: '#A3DFFF', marginTop: '4px' }}>{loserName}</div>
              </div>
            </div>
          </div>

          {/* Winning Song */}
          {winningSong && (
            <div style={cardStyle}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#00FFE6', letterSpacing: '3px', marginBottom: '16px' }}>
                THE WINNING SONG
              </p>
              {winningSong.album_art && (
                <img
                  src={winningSong.album_art}
                  alt="Album Art"
                  style={{ width: 200, height: 200, borderRadius: 4, margin: '0 auto 16px', display: 'block' }}
                />
              )}
              <p style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                &ldquo;{winningSong.title}&rdquo;
              </p>
              <p style={{ fontSize: '15px', color: '#A3DFFF', marginBottom: '20px' }}>
                by {winningSong.artist}
              </p>
              {hasSpotifyId && (
                <button
                  style={spotifyButtonStyle}
                  onClick={() => {
                    window.location.href = `spotify:track:${winningSong.spotify_id}`;
                    setTimeout(() => {
                      window.location.href = `https://open.spotify.com/track/${winningSong.spotify_id}`;
                    }, 1000);
                  }}
                >
                  🎵 Listen on Spotify
                </button>
              )}
            </div>
          )}

          {/* Download */}
          <a href="https://songmatchgame.com" style={outlineButtonStyle}>
            Download SongMatch
          </a>
          <p style={{ fontSize: '13px', color: '#A3DFFF' }}>Think you could&apos;ve picked better?</p>
        </div>
      </div>
    );
  }

  // Default challenge view
  return (
    <div style={bgStyle}>
      <div style={containerStyle}>
        <div style={logoStyle}>♪ SONGMATCH</div>
        <div style={cardStyle}>
          <p style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
            {challenge.challenger_display_name} challenged you!
          </p>
          <p style={{ fontSize: '17px', color: '#A3DFFF', marginBottom: '20px' }}>
            Can you beat their score?
          </p>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#FFD700', marginBottom: '8px' }}>
            {parseFloat(challenge.challenger_score).toFixed(2)}
          </div>
          <p style={{ fontSize: '13px', color: '#A3DFFF' }}>points</p>
        </div>
        <a href={`songmatch://challenge/${challengeId}`} style={primaryButtonStyle}>
          Open in SongMatch
        </a>
        <a href="https://songmatchgame.com" style={outlineButtonStyle}>
          Download SongMatch
        </a>
      </div>
    </div>
  );
}