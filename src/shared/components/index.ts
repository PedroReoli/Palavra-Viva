/**
 * Palavra Viva — Componentes Compartilhados
 *
 * Re-export de todos os componentes do design system.
 *
 * Uso:
 *   import { Heading, Body, Button, Card } from '@/shared/components';
 */

// Typography
export { Heading, Body, Caption, VerseText } from './Typography';

// Interacao
export { default as Button } from './Button';
export { default as Input } from './Input';

// Layout
export { default as Card } from './Card';
export { default as Modal } from './Modal';
export { default as BottomSheet } from './BottomSheet';

// Informacao
export { default as Badge } from './Badge';
export { default as Avatar } from './Avatar';

// Biblico
export { default as VerseCard } from './VerseCard';
