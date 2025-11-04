import React, { useContext } from 'react';
import { View, Text, Switch } from 'react-native';
import { ContextoTema } from '../tema/tema';

export default function InterruptorModo() {
  const { oscuro, setOscuro } = useContext(ContextoTema);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text style={{ color: oscuro ? '#fff' : '#000', fontSize: 14 }}>Modo oscuro</Text>
      <Switch value={oscuro} onValueChange={setOscuro} />
    </View>
  );
}