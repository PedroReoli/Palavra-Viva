export interface Devotional {
  id: string;
  userId: string;
  date: string;
  verseId: string | null;
  reflection: string;
  prayer: string | null;
  application: string | null;
  createdAt: string;
}

export interface GeneratedDevotional {
  verse: string;
  verseReference: string;
  reflection: string;
  prayer: string;
  application: string;
}
