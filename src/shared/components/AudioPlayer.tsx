import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Gauge } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body, Caption } from './Typography';
import { audioService, type AudioState } from '@/features/audio-player/services/audioService';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface AudioPlayerProps {
  uri: string;
  title: string;
  subtitle?: string;
  mode?: 'mini' | 'full';
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function AudioPlayer({
  uri,
  title,
  subtitle,
  mode = 'mini',
}: AudioPlayerProps) {
  const { colors } = useTheme();
  const [state, setState] = useState<AudioState>(audioService.getDefaultState());

  useEffect(() => {
    audioService.configure();
    return () => {
      audioService.stop();
    };
  }, []);

  const handlePlayPause = async () => {
    if (!state.isLoaded) {
      await audioService.play(uri, setState);
    } else if (state.isPlaying) {
      await audioService.pause();
    } else {
      await audioService.resume();
    }
  };

  const handleRate = async () => {
    const next = audioService.getNextRate(state.rate);
    await audioService.setRate(next);
  };

  const handleSeekBack = async () => {
    await audioService.seekTo(Math.max(0, state.positionMs - 15000));
  };

  const handleSeekForward = async () => {
    await audioService.seekTo(Math.min(state.durationMs, state.positionMs + 15000));
  };

  const progress = state.durationMs > 0 ? (state.positionMs / state.durationMs) * 100 : 0;

  if (mode === 'mini') {
    return (
      <View style={[styles.miniContainer, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
        {/* Barra de progresso */}
        <View style={[styles.progressBar, { backgroundColor: colors.surfaceVariant }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
        </View>

        <View style={styles.miniContent}>
          <View style={styles.miniInfo}>
            <Body variant="small" numberOfLines={1}>{title}</Body>
            {subtitle && <Caption color={colors.textTertiary} numberOfLines={1}>{subtitle}</Caption>}
          </View>
          <Pressable onPress={handlePlayPause} style={styles.playButton}>
            {state.isPlaying ? (
              <Pause size={22} color={colors.primary} weight="fill" />
            ) : (
              <Play size={22} color={colors.primary} weight="fill" />
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // Modo full
  return (
    <View style={[styles.fullContainer, { backgroundColor: colors.background }]}>
      <Body variant="medium" numberOfLines={2} style={styles.fullTitle}>{title}</Body>
      {subtitle && <Caption color={colors.textSecondary}>{subtitle}</Caption>}

      {/* Barra de progresso */}
      <View style={styles.fullProgressSection}>
        <View style={[styles.fullProgressBar, { backgroundColor: colors.surfaceVariant }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Caption color={colors.textTertiary}>{formatMs(state.positionMs)}</Caption>
          <Caption color={colors.textTertiary}>{formatMs(state.durationMs)}</Caption>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        <Pressable onPress={handleSeekBack} hitSlop={12}>
          <SkipBack size={28} color={colors.icon} />
        </Pressable>

        <Pressable
          onPress={handlePlayPause}
          style={[styles.mainPlayButton, { backgroundColor: colors.primary }]}
        >
          {state.isPlaying ? (
            <Pause size={28} color={colors.textOnPrimary} weight="fill" />
          ) : (
            <Play size={28} color={colors.textOnPrimary} weight="fill" />
          )}
        </Pressable>

        <Pressable onPress={handleSeekForward} hitSlop={12}>
          <SkipForward size={28} color={colors.icon} />
        </Pressable>
      </View>

      {/* Velocidade */}
      <Pressable onPress={handleRate} style={styles.rateButton}>
        <Gauge size={16} color={colors.iconSecondary} />
        <Caption variant="medium" color={colors.textSecondary}>{state.rate}x</Caption>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Mini
  miniContainer: {
    borderTopWidth: 1,
  },
  progressBar: {
    height: 2,
  },
  progressFill: {
    height: '100%',
  },
  miniContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  miniInfo: {
    flex: 1,
    gap: 1,
  },
  playButton: {
    padding: spacing.xs,
  },

  // Full
  fullContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  fullTitle: {
    textAlign: 'center',
  },
  fullProgressSection: {
    width: '100%',
    gap: spacing.xs,
  },
  fullProgressBar: {
    height: 4,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  mainPlayButton: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
});
