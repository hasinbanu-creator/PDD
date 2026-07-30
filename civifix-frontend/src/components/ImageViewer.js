import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const getTouchDistance = (evt) => {
  const touches = evt.nativeEvent.touches;
  if (touches && touches.length >= 2) {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  return 0;
};

export default function ImageViewer({ visible, imageUrl, onClose }) {
  const scale = useRef(new Animated.Value(1)).current;
  const translate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  
  const lastScale = useRef(1);
  const lastTranslate = useRef({ x: 0, y: 0 });
  const initialDistance = useRef(0);
  const isPinching = useRef(false);
  const lastTap = useRef(0);

  // Reset values when opened/closed
  useEffect(() => {
    if (visible) {
      scale.setValue(1);
      translate.setValue({ x: 0, y: 0 });
      lastScale.current = 1;
      lastTranslate.current = { x: 0, y: 0 };
      initialDistance.current = 0;
      isPinching.current = false;
    }
  }, [visible]);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      if (lastScale.current > 1) {
        // Zoom out
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          Animated.spring(translate, { toValue: { x: 0, y: 0 }, useNativeDriver: true })
        ]).start(() => {
          lastScale.current = 1;
          lastTranslate.current = { x: 0, y: 0 };
        });
      } else {
        // Zoom in to 2.5
        Animated.parallel([
          Animated.spring(scale, { toValue: 2.5, useNativeDriver: true }),
          Animated.spring(translate, { toValue: { x: 0, y: 0 }, useNativeDriver: true })
        ]).start(() => {
          lastScale.current = 2.5;
          lastTranslate.current = { x: 0, y: 0 };
        });
      }
    }
    lastTap.current = now;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleDoubleTap();
        const touches = evt.nativeEvent.touches;
        if (touches && touches.length >= 2) {
          isPinching.current = true;
          initialDistance.current = getTouchDistance(evt);
        } else {
          isPinching.current = false;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches && touches.length >= 2) {
          const currentDistance = getTouchDistance(evt);
          if (initialDistance.current > 0 && currentDistance > 0) {
            let newScale = (currentDistance / initialDistance.current) * lastScale.current;
            newScale = Math.max(1, Math.min(newScale, 5));
            scale.setValue(newScale);
          }
        } else if (touches && touches.length === 1 && !isPinching.current) {
          if (lastScale.current > 1) {
            const newX = lastTranslate.current.x + gestureState.dx;
            const newY = lastTranslate.current.y + gestureState.dy;
            translate.setValue({ x: newX, y: newY });
          }
        }
      },
      onPanResponderRelease: () => {
        lastScale.current = scale._value;
        lastTranslate.current = { x: translate.x._value, y: translate.y._value };

        if (lastScale.current <= 1) {
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(translate, { toValue: { x: 0, y: 0 }, useNativeDriver: true })
          ]).start();
          lastScale.current = 1;
          lastTranslate.current = { x: 0, y: 0 };
        } else {
          const maxTranslateX = (SCREEN_WIDTH * (lastScale.current - 1)) / 2;
          const maxTranslateY = (SCREEN_HEIGHT * (lastScale.current - 1)) / 2;
          
          let boundedX = lastTranslate.current.x;
          let boundedY = lastTranslate.current.y;
          let needsSpring = false;

          if (Math.abs(boundedX) > maxTranslateX) {
            boundedX = boundedX > 0 ? maxTranslateX : -maxTranslateX;
            needsSpring = true;
          }
          if (Math.abs(boundedY) > maxTranslateY) {
            boundedY = boundedY > 0 ? maxTranslateY : -maxTranslateY;
            needsSpring = true;
          }

          if (needsSpring) {
            Animated.spring(translate, {
              toValue: { x: boundedX, y: boundedY },
              useNativeDriver: true
            }).start(() => {
              lastTranslate.current = { x: boundedX, y: boundedY };
            });
          }
        }
      }
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </SafeAreaView>

        <View
          style={styles.imageContainer}
          {...panResponder.panHandlers}
        >
          <Animated.Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              {
                transform: [
                  { scale: scale },
                  { translateX: translate.x },
                  { translateY: translate.y }
                ]
              }
            ]}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  safeArea: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  }
});
