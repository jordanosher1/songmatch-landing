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

  try {
    const res = await fetch(
      `https://songmatch-backend-production.up.railway.app/api/challenges/${challengeId}`
    );
    const data = await res.json();

    if (data.status === 'ok' && data.challenge) {
      challengerName = data.challenge.challenger_name || 'A friend';
      challengerScore = data.challenge.challenger_score?.toFixed(2) || '???';
      challengerAvatar = data.challenge.challenger_avatar || '';
    }
  } catch (e) {
    console.error('Failed to fetch challenge:', e);
  }

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
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            fontWeight: 700,
            color: '#FF00FF',
            marginBottom: '40px',
          }}
        >
          ♪ SONGMATCH
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '56px',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '40px',
          }}
        >
          You've been challenged!
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          {challengerAvatar ? (
            <img
              src={challengerAvatar}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '40px',
                border: '3px solid #00FFE6',
                marginRight: '24px',
              }}
            />
          ) : (
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '40px',
                backgroundColor: '#666666',
                border: '3px solid #00FFE6',
                marginRight: '24px',
                display: 'flex',
              }}
            />
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '36px',
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              {challengerName} scored: {challengerScore} points
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                color: '#A3DFFF',
                marginTop: '8px',
              }}
            >
              Can you beat their score?
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '28px',
            color: '#FFFFFF',
            marginBottom: '40px',
          }}
        >
          SongMatch is the game where you're the DJ. Read personal stories and try to play the perfect song.
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            fontWeight: 600,
            color: '#00FFE6',
            width: '100%',
            justifyContent: 'flex-end',
          }}
        >
          Tap to play →
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}