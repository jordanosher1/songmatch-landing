import React from 'react';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ogImageUrl = `https://www.songmatchgame.com/api/og/${id}`;

  return {
    title: "You've been challenged on SongMatch!",
    description: 'Can you beat their score? Match songs to stories in this music game.',
    openGraph: {
      title: "You've been challenged on SongMatch!",
      description: 'Can you beat their score? Match songs to stories in this music game.',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "You've been challenged on SongMatch!",
      description: 'Can you beat their score? Match songs to stories in this music game.',
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