import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, Animated, Pressable, Share } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import BotonAnimado from '../Componentes/BotonAnimado';
import VistaAparecer from '../Componentes/VistaAparecer';
import AccionesDerecha from '../Componentes/AccionesDerecha';
import { ContextoTema } from '../tema/ContextoTema';
import { obtenerSaludoPorHora, normalizarCategoria } from '../utilidades/utilidades';
import { EJERCICIOS_POR_RUTINA } from '../datos/ejerciciosPorRutina';

export default function PantallaEjercicios({ route, navigation }) {
  const { paleta } = useContext(ContextoTema);
  const { nombre, tipoRutina } = route.params ?? { nombre: 'Usuario', tipoRutina: 'General' };

  const [busqueda, setBusqueda] = useState('');
  const [repeticiones, setRepeticiones] = useState('');
  const [series, setSeries] = useState('');
  const [seleccion, setSeleccion] = useState('');
  const [listaRutina, setListaRutina] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);

  const saludo = `${obtenerSaludoPorHora()}, ${nombre}!`;
  const categoria = normalizarCategoria(tipoRutina);
  const base = EJERCICIOS_POR_RUTINA[categoria] ?? EJERCICIOS_POR_RUTINA['General'];

  useEffect(() => {
    if (!busqueda.trim()) return setSugerencias([]);
    const q = busqueda.trim().toLowerCase();
    setSugerencias(base.filter((e) => e.toLowerCase().includes(q)).slice(0, 8));
  }, [busqueda, base]);

  const agregarEjercicio = () => {
    const ejercicio = (seleccion || busqueda).trim();
    const rep = parseInt(repeticiones, 10);
    const ser = parseInt(series, 10);
    if (!ejercicio || isNaN(rep) || isNaN(ser) || rep <= 0 || ser <= 0) return;

    setListaRutina((prev) => [{ id: Date.now().toString(), ejercicio, reps: rep, sets: ser }, ...prev]);
    setBusqueda(''); setSeleccion(''); setRepeticiones(''); setSeries(''); setSugerencias([]);
  };

  const compartir = async () => {
    const fecha = new Date().toLocaleDateString();
    const header = `Rutina de ${nombre} — ${tipoRutina} (${fecha})\n`;
    const cuerpo = listaRutina.length
      ? listaRutina.map((it, i) => `${i + 1}. ${it.ejercicio}: ${it.sets}×${it.reps}`).join('\n')
      : 'Aún no hay ejercicios agregados.';
    await Share.share({ message: `${header}\n${cuerpo}\n\n#MiRutina`, title: 'Compartir rutina' });
  };

  const refsAnim = useRef({});
  const animarYEliminar = (id) => {
    const ref = refsAnim.current[id];
    if (!ref) return setListaRutina((prev) => prev.filter((x) => x.id !== id));
    const { opacidad, alto } = ref;
    Animated.parallel([
      Animated.timing(opacidad, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(alto, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start(() => {
      setListaRutina((prev) => prev.filter((x) => x.id !== id));
      delete refsAnim.current[id];
    });
  };

  const renderItem = ({ item }) => {
    if (!refsAnim.current[item.id]) {
      refsAnim.current[item.id] = { opacidad: new Animated.Value(1), alto: new Animated.Value(84) };
    }
    const { opacidad, alto } = refsAnim.current[item.id];
    let refSwipe = null;

    return (
      <Swipeable
        ref={(r) => (refSwipe = r)}
        renderRightActions={() => (
          <AccionesDerecha alEliminar={() => { animarYEliminar(item.id); refSwipe?.close(); }} />
        )}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
      >
        <Animated.View
          style={{
            opacity: opacidad,
            height: alto,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: paleta.borde,
            borderRadius: 10,
            padding: 12,
            backgroundColor: paleta.fondo,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: paleta.texto }}>{item.ejercicio}</Text>
            <Text style={{ color: paleta.texto }}>{item.sets}×{item.reps}</Text>
          </View>

          <BotonAnimado
            titulo="Eliminar"
            onPress={() => animarYEliminar(item.id)}
            estilo={{ backgroundColor: '#ff5b5b', paddingHorizontal: 14, paddingVertical: 8 }}
            estiloTexto={{ fontSize: 14 }}
          />
        </Animated.View>
      </Swipeable>
    );
  };

  return (
    <VistaAparecer estilo={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center', backgroundColor: paleta.fondo }} duracion={350}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 4, color: paleta.texto }}>{saludo}</Text>
      <Text style={{ fontSize: 16, marginBottom: 8, color: paleta.texto }}>Rutina: {categoria}</Text>

      <View style={{ gap: 10, padding: 16, borderRadius: 12, backgroundColor: paleta.tarjeta }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: paleta.texto }}>Buscar ejercicio (de {categoria})</Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10, borderRadius: 8, color: paleta.texto, borderColor: paleta.borde }}
          placeholder={`Ej: ${base[0] || 'Sentadillas'}`}
          placeholderTextColor={paleta.placeholder}
          value={busqueda}
          onChangeText={(t) => { setBusqueda(t); setSeleccion(''); }}
        />
        {sugerencias.length > 0 && (
          <View style={{ marginTop: 6, borderWidth: 1, borderRadius: 8, overflow: 'hidden', borderColor: paleta.borde, backgroundColor: paleta.fondo }}>
            {sugerencias.map((it) => (
              <Pressable key={it} onPress={() => { setSeleccion(it); setBusqueda(it); }} style={{ paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#00000010' }}>
                <Text style={{ color: paleta.texto }}>{it}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: paleta.texto }}>Repeticiones</Text>
            <TextInput
              style={{ borderWidth: 1, padding: 10, borderRadius: 8, color: paleta.texto, borderColor: paleta.borde }}
              placeholder="Ej: 12"
              placeholderTextColor={paleta.placeholder}
              keyboardType="number-pad"
              value={repeticiones}
              onChangeText={setRepeticiones}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: paleta.texto }}>Series</Text>
            <TextInput
              style={{ borderWidth: 1, padding: 10, borderRadius: 8, color: paleta.texto, borderColor: paleta.borde }}
              placeholder="Ej: 4"
              placeholderTextColor={paleta.placeholder}
              keyboardType="number-pad"
              value={series}
              onChangeText={setSeries}
            />
          </View>
        </View>

        <BotonAnimado titulo="Agregar a la rutina" onPress={agregarEjercicio} estilo={{ backgroundColor: paleta.primario, marginTop: 12 }} />
      </View>

      <View style={{ padding: 16, borderRadius: 12, borderWidth: 1, gap: 6, backgroundColor: paleta.tarjeta, borderColor: paleta.borde }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: paleta.texto, marginBottom: 8 }}>Tu rutina de hoy</Text>
        {listaRutina.length === 0 ? (
          <Text style={{ color: paleta.texto }}>Aún no agregas ejercicios.</Text>
        ) : (
          <FlatList
            data={listaRutina}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={renderItem}
          />
        )}
      </View>

      <BotonAnimado titulo="Compartir rutina" onPress={compartir} rotarAlPresionar estilo={{ backgroundColor: paleta.primario, marginTop: 12 }} />
      <BotonAnimado titulo="Volver" onPress={() => navigation.goBack()} estilo={{ backgroundColor: '#6b7280', marginTop: 8 }} />
    </VistaAparecer>
  );
}