import React, { useContext, useState } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet } from 'react-native';
import VistaAparecer from '../Componentes/VistaAparecer';
import BotonAnimado from '../Componentes/BotonAnimado';
import { ContextoTema } from '../tema/ContextoTema';
import { obtenerSaludoPorHora } from '../utilidades/utilidades';

export default function PantallaInicio({ navigation }) {
  const { paleta, oscuro } = useContext(ContextoTema);
  const [nombre, setNombre] = useState('');
  const [tipoRutina, setTipoRutina] = useState('');
  const saludo = `${obtenerSaludoPorHora()}, ${nombre}! `;

  return (
    <View style={{ flex: 1, backgroundColor: paleta.fondo }}>
      <ImageBackground
        source={require('../assets/fondo.jpg')}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        resizeMode="cover"
      >
        {oscuro && <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' }} />}

        <VistaAparecer duracion={450}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', textShadowColor: '#0006', textShadowRadius: 4 }}>
            {saludo}
          </Text>
        </VistaAparecer>

        <VistaAparecer duracion={450} retraso={120}>
          <View style={{ gap: 10, padding: 16, borderRadius: 12, backgroundColor: paleta.tarjeta, width: '85%', borderColor: paleta.borde, borderWidth: 1 }}>
            <Text style={{ color: paleta.texto, fontWeight: '600' }}>Tu nombre</Text>
            <TextInput
              style={{ borderWidth: 1, padding: 10, borderRadius: 8, color: paleta.texto, borderColor: paleta.borde }}
              placeholder="Escribe tu nombre"
              placeholderTextColor={paleta.placeholder}
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={{ color: paleta.texto, fontWeight: '600' }}>Tipo de rutina</Text>
            <TextInput
              style={{ borderWidth: 1, padding: 10, borderRadius: 8, color: paleta.texto, borderColor: paleta.borde }}
              placeholder="Ej: Piernas y Glúteos, Tren superior, Core y Cardio, Full Body"
              placeholderTextColor={paleta.placeholder}
              value={tipoRutina}
              onChangeText={setTipoRutina}
            />

            <BotonAnimado
              titulo="Empezar rutina"
              onPress={() => navigation.navigate('Ejercicios', { nombre, tipoRutina })}
              estilo={{ backgroundColor: paleta.primario }}
            />
          </View>
        </VistaAparecer>
      </ImageBackground>
    </View>
  );
}