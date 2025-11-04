import React, { useEffect, useRef } from 'react';
import { Text, Animated, Pressable, Easing, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function BotonAnimado({ titulo, onPress, estilo, estiloTexto, rotarAlPresionar = false }) {
  const escala = useRef(new Animated.Value(1)).current;
  const giro = useRef(new Animated.Value(0)).current;
  const refSonido = useRef(null);

  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(require('../assets/click.mp3'));
      refSonido.current = sound;
    })();
    return () => refSonido.current?.unloadAsync();
  }, []);

  const reproducir = async () => { try { await refSonido.current?.replayAsync(); } catch {} };

  const entrar = () => Animated.spring(escala, { toValue: 0.96, useNativeDriver: true }).start();
  const salir  = () => Animated.spring(escala, { toValue: 1,    useNativeDriver: true }).start();

  const manejarPresion = async () => {
    await reproducir();
    if (rotarAlPresionar) {
      giro.setValue(0);
      Animated.timing(giro, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    }
    onPress?.();
  };

  const giroDeg = giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Pressable onPress={manejarPresion} onPressIn={entrar} onPressOut={salir}>
      <Animated.View style={[estilos.boton, estilo, { transform: [{ scale: escala }, { rotate: rotarAlPresionar ? giroDeg : '0deg' }] }]}>
        <Text style={[estilos.textoBoton, estiloTexto]}>{titulo}</Text>
      </Animated.View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  textoBoton: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
