import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function VistaAparecer({ children, estilo, duracion = 350, retraso = 0 }) {
  const opacidad = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacidad, { toValue: 1, duration: duracion, delay: retraso, useNativeDriver: true }).start();
  }, [opacidad, duracion, retraso]);
  return <Animated.View style={[estilo, { opacity: opacidad }]}>{children}</Animated.View>;
}