import React from 'react';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
export const runtime = 'edge';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: challengeId } = await params;
  let challengerName = 'A friend';
  let challengerScore = '???';
  let challengerAvatar = '';
  let isCompleted = false;
  let winnerName = '';
  let loserName = '';
  let margin = '';
  let winningSong: { title: string; artist: string; album_art: string; spotify_id: string } | null = null;

  try {
    const res = await fetch(
      `https://songmatch-backend-production.up.railway.app/api/challenges/code/${challengeId}`
    );
    const data = await res.json();
    if (data.status === 'ok' && data.challenge) {
      const c = data.challenge;
      challengerName = c.challenger_display_name || c.challenger_name || 'A friend';
      challengerScore = parseFloat(c.challenger_score)?.toFixed(2) || '???';
      challengerAvatar = c.challenger_avatar || '';

      if (c.winner && c.responder_display_name) {
        isCompleted = true;
        const winnerScore = parseFloat(c.winner === 'challenger' ? c.challenger_score : c.responder_score);
        const loserScore = parseFloat(c.winner === 'challenger' ? c.responder_score : c.challenger_score);
        winnerName = c.winner === 'challenger' ? c.challenger_display_name : c.responder_display_name;
        loserName = c.winner === 'challenger' ? c.responder_display_name : c.challenger_display_name;
        margin = Math.abs(winnerScore - loserScore).toFixed(2);
        winningSong = c.winning_song || null;
      }
    }
  } catch (e) {
    console.error('Failed to fetch challenge:', e);
  }

  // Results OG image
  if (isCompleted && winningSong) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #081C2E 0%, #101B3B 40%, #1E0050 100%)',
            padding: '60px',
            gap: '48px',
          }}
        >
          {/* Album Art */}
          {winningSong.album_art ? (
            <img
              src={winningSong.album_art}
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '8px',
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '8px',
                backgroundColor: '#1E3050',
                flexShrink: 0,
                display: 'flex',
              }}
            />
          )}

          {/* Right Side */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700, color: '#00FFE6', marginBottom: '24px' }}>
              ♪ SONGMATCH
            </div>
            <div style={{ display: 'flex', fontSize: '48px', fontWeight: 800, color: '#FFD700', marginBottom: '8px' }}>
              🏆 {winnerName} WINS!
            </div>
            <div style={{ display: 'flex', fontSize: '28px', color: '#A3DFFF', marginBottom: '32px' }}>
              Beat {loserName} by {margin} points
            </div>
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              &ldquo;{winningSong.title}&rdquo;
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: '#A3DFFF' }}>
              by {winningSong.artist}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default challenge OG image
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #081C2E 0%, #101B3B 40%, #1E0050 100%)',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', fontSize: '32px', fontWeight: 700, color: '#00FFE6', marginBottom: '40px' }}>
          ♪ SONGMATCH
        </div>
        <div style={{ display: 'flex', fontSize: '56px', fontWeight: 800, color: '#FFFFFF', marginBottom: '40px' }}>
          You&apos;ve been challenged!
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '40px' }}>
          {challengerAvatar ? (
            <img
              src={challengerAvatar}
              style={{ width: '80px', height: '80px', borderRadius: '40px', border: '3px solid #00FFE6', marginRight: '24px' }}
            />
          ) : (
            <div
              style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#666666', border: '3px solid #00FFE6', marginRight: '24px', display: 'flex' }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: '36px', fontWeight: 600, color: '#FFFFFF' }}>
              {challengerName} scored: {challengerScore} points
            </div>
            <div style={{ display: 'flex', fontSize: '28px', color: '#A3DFFF', marginTop: '8px' }}>
              Can you beat their score?
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: '28px', color: '#FFFFFF', marginBottom: '40px' }}>
          SongMatch is the game where you&apos;re the DJ. Read personal stories and try to play the perfect song.
        </div>
        <div style={{ display: 'flex', fontSize: '32px', fontWeight: 600, color: '#00FFE6', width: '100%', justifyContent: 'flex-end' }}>
          Tap to play →
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}