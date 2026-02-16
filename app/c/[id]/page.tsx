'use client';

import React from 'react';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.id as string;
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-white" style={{ background: 'linear-gradient(180deg, #1E0050 0%, #101B3B 60%, #081C2E 100%)' }}>
        <div className="text-center max-w-[400px]">
          <div className="text-3xl font-bold text-[#00FFE6] mb-10 tracking-wider">SONGMATCH</div>
          <p className="text-[#A3DFFF] text-lg">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-white" style={{ background: 'linear-gradient(180deg, #1E0050 0%, #101B3B 60%, #081C2E 100%)' }}>
        <div className="text-center max-w-[400px]">
          <div className="text-3xl font-bold text-[#00FFE6] mb-10 tracking-wider">SONGMATCH</div>
          <p className="text-[#FF6B6B] text-base">Challenge not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-white" style={{ background: 'linear-gradient(180deg, #1E0050 0%, #101B3B 60%, #081C2E 100%)' }}>
      <div className="text-center max-w-[400px]">
        <div className="text-3xl font-bold text-[#00FFE6] mb-10 tracking-wider">SONGMATCH</div>
        <div className="bg-[rgba(12,20,38,0.9)] border border-[#00FFF0] rounded-2xl p-8 mb-8">
          <p className="text-2xl font-bold mb-3">{challenge.challenger_name} challenged you!</p>
          <p className="text-lg text-[#A3DFFF] mb-5">Can you beat their score?</p>
          <div className="text-5xl font-bold text-[#FFD700] mb-3">{challenge.challenger_score.toFixed(2)}</div>
          <p className="text-sm text-[#A3DFFF]">points</p>
        </div>
        <a href={`songmatch://challenge/${challengeId}`} className="block w-full py-4 px-6 rounded-full text-lg font-semibold bg-[#00FFE6] text-[#0D1B2A] mb-4 hover:opacity-80 transition-opacity text-center">
          Open in SongMatch
        </a>
        <a href="https://apps.apple.com/app/songmatch" className="block w-full py-4 px-6 rounded-full text-lg font-semibold bg-transparent text-[#00FFE6] border-2 border-[#00FFE6] hover:opacity-80 transition-opacity text-center">
          Download SongMatch
        </a>
      </div>
    </div>
  );
}