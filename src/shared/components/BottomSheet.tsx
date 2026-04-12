import { useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { ReactNode } from 'react';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DEFAULT_HEIGHT = SCREEN_HEIGHT * 0.5;
const ANIMATION_DURATION = 250;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function BottomSheet({
  visible,
  onClose,
  children,
  height = DEFAULT_HEIGHT,
  style,
}: BottomSheetProps) {
  const { colors } = useTheme();
  const translateY = useSharedValue(height);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: ANIMATION_DURATION });
      overlayOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    } else {
      translateY.value = withTiming(height, { duration: ANIMATION_DURATION });
      overlayOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    }
  }, [visible, height, translateY, overlayOpacity]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleClose = () => {
    translateY.value = withTiming(height, { duration: ANIMATION_DURATION }, () => {
      runOnJS(onClose)();
    });
    overlayOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        {/* Overlay */}
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
            onPress={handleClose}
          />
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              height,
              backgroundColor: colors.surfaceElevated,
            },
            shadows.lg,
            sheetStyle,
            style,
          ]}
        >
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Conteudo */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radii.full,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
});
