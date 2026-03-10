import React from 'react';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ogImageUrl = `https://www.songmatchgame.com/api/og/${id}`;

  let title = "You've been challenged on SongMatch!";
  let description = 'Can you beat their score? Match songs to stories in this music game.';

  try {
    const res = await fetch(
      `https://songmatch-backend-production.up.railway.app/api/challenges/code/${id}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    if (data.status === 'ok' && data.challenge) {
      const c = data.challenge;
      const name = c.challenger_display_name || 'A friend';
      const score = parseFloat(c.challenger_score)?.toFixed(2);

      if (c.winner && c.responder_display_name) {
        // Completed challenge — results view
        const winnerName = c.winner === 'challenger' ? c.challenger_display_name : c.responder_display_name;
        const loserName = c.winner === 'challenger' ? c.responder_display_name : c.challenger_display_name;
        const winnerScore = parseFloat(c.winner === 'challenger' ? c.challenger_score : c.responder_score).toFixed(2);
        const loserScore = parseFloat(c.winner === 'challenger' ? c.responder_score : c.challenger_score).toFixed(2);
        const margin = Math.abs(parseFloat(winnerScore) - parseFloat(loserScore)).toFixed(2);
        title = `${winnerName} beat ${loserName} on SongMatch!`;
        description = `${winnerName} won ${winnerScore} to ${loserScore} — a margin of ${margin} points. Think you could've picked better?`;
      } else if (score) {
        // Open challenge — invite view
        title = `${name} challenged you on SongMatch!`;
        description = `${name} scored ${score} points. Can you beat them? Match songs to stories in this music game.`;
      }
    }
  } catch (e) {
    // Fall through to defaults
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}