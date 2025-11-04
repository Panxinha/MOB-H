import React from 'react';
import { View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export default function AccionesDerecha({ alEliminar }) {
  return (
    <View style={{ flexDirection: 'row', height: '100%' }}>
      <RectButton
        onPress={alEliminar}
        style={{ width: 96, backgroundColor: '#ff5b5b', justifyContent: 'center', alignItems: 'center', height: '100%' }}
      >
        <Text style={{ color: '#fff', fontWeight: '800' }}>Eliminar</Text>
      </RectButton>
    </View>
  );
}