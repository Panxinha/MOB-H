import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Button, Share, StyleSheet } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { ContextoTema } from '../tema/tema';
import { obtenerSaludoPorHora, normalizarCategoria } from '../utilidades/utilidades';
import { EJERCICIOS_POR_RUTINA } from '../datos/ejercicios';

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

  function agregarEjercicio() {
    const ejercicio = (seleccion || busqueda).trim();
    const rep = parseInt(repeticiones, 10);
    const ser = parseInt(series, 10);
    if (!ejercicio || isNaN(rep) || isNaN(ser) || rep <= 0 || ser <= 0) return;

    setListaRutina([{ id: Date.now().toString(), ejercicio, reps: rep, sets: ser }, ...listaRutina]);
    setBusqueda('');
    setSeleccion('');
    setRepeticiones('');
    setSeries('');
    setSugerencias([]);
  }

  async function compartir() {
    const fecha = new Date().toLocaleDateString();
    const header = `Rutina de ${nombre} — ${tipoRutina} (${fecha})\n`;
    const cuerpo = listaRutina.length
      ? listaRutina.map((it, i) => `${i + 1}. ${it.ejercicio}: ${it.sets}×${it.reps}`).join('\n')
      : 'Aún no hay ejercicios agregados.';
    await Share.share({ message: `${header}\n${cuerpo}\n\n#MiRutina`, title: 'Compartir rutina' });
  }

  function eliminar(id) {
    setListaRutina(listaRutina.filter((x) => x.id !== id));
  }

  function AccionEliminar({ onPress }) {
    return (
      <View style={{ height: '100%', flexDirection: 'row' }}>
        <RectButton onPress={onPress} style={styles.botonEliminar}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Eliminar</Text>
        </RectButton>
      </View>
    );
  }

  function renderItem({ item }) {
    let refSwipe = null;
    return (
      <Swipeable
        ref={(r) => (refSwipe = r)}
        renderRightActions={() => (
          <AccionEliminar
            onPress={() => {
              eliminar(item.id);
              refSwipe?.close();
            }}
          />
        )}
        overshootRight={false}
      >
        <View style={[styles.item, { borderColor: paleta.borde, backgroundColor: paleta.fondo }]}>
          <View style={{ flexShrink: 1 }}>
            <Text style={[styles.itemTitulo, { color: paleta.texto }]}>{item.ejercicio}</Text>
            <Text style={{ color: paleta.texto }}>{item.sets}×{item.reps}</Text>
          </View>
          <Button title="Eliminar" color="#ff5b5b" onPress={() => eliminar(item.id)} />
        </View>
      </Swipeable>
    );
  }

  return (
    <View style={[styles.pantalla, { backgroundColor: paleta.fondo }]}>
      <Text style={[styles.titulo, { color: paleta.texto }]}>{saludo}</Text>
      <Text style={[styles.subtitulo, { color: paleta.texto }]}>Rutina: {categoria}</Text>

      {/* Caja de entrada */}
      <View style={[styles.tarjeta, { backgroundColor: paleta.tarjeta, borderColor: paleta.borde }]}>
        <Text style={[styles.etiqueta, { color: paleta.texto }]}>Buscar ejercicio (de {categoria})</Text>
        <TextInput
          style={[styles.input, { color: paleta.texto, borderColor: paleta.borde }]}
          placeholder={`Ej: ${base[0] || 'Sentadillas'}`}
          placeholderTextColor={paleta.placeholder}
          value={busqueda}
          onChangeText={(t) => { setBusqueda(t); setSeleccion(''); }}
        />

        {sugerencias.length > 0 && (
          <View style={[styles.sugerencias, { borderColor: paleta.borde, backgroundColor: paleta.fondo }]}>
            {sugerencias.map((it) => (
              <Pressable
                key={it}
                onPress={() => { setSeleccion(it); setBusqueda(it); }}
                style={styles.sugerencia}
              >
                <Text style={{ color: paleta.texto }}>{it}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.fila}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.etiqueta, { color: paleta.texto }]}>Repeticiones</Text>
            <TextInput
              style={[styles.input, { color: paleta.texto, borderColor: paleta.borde }]}
              placeholder="Ej: 12"
              placeholderTextColor={paleta.placeholder}
              keyboardType="number-pad"
              value={repeticiones}
              onChangeText={setRepeticiones}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.etiqueta, { color: paleta.texto }]}>Series</Text>
            <TextInput
              style={[styles.input, { color: paleta.texto, borderColor: paleta.borde }]}
              placeholder="Ej: 4"
              placeholderTextColor={paleta.placeholder}
              keyboardType="number-pad"
              value={series}
              onChangeText={setSeries}
            />
          </View>
        </View>

        <Button title="Agregar a la rutina" onPress={agregarEjercicio} color={paleta.primario} />
      </View>

      {/* Lista */}
      <View style={[styles.tarjeta, { backgroundColor: paleta.tarjeta, borderColor: paleta.borde }]}>
        <Text style={[styles.etiqueta, { color: paleta.texto, marginBottom: 8 }]}>Tu rutina de hoy</Text>
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

      <View style={{ gap: 8 }}>
        <Button title="Compartir rutina" onPress={compartir} color={paleta.primario} />
        <Button title="Volver" onPress={() => navigation.goBack()} color="#6b7280" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  subtitulo: { fontSize: 14 },
  tarjeta: { gap: 10, padding: 12, borderRadius: 8, borderWidth: 1 },
  etiqueta: { fontSize: 13, fontWeight: '600' },
  input: { borderWidth: 1, padding: 8, borderRadius: 6, fontSize: 14 },
  fila: { flexDirection: 'row', gap: 10 },
  sugerencias: { marginTop: 6, borderWidth: 1, borderRadius: 6, overflow: 'hidden' },
  sugerencia: { paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#00000010' },
  item: { borderWidth: 1, borderRadius: 8, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitulo: { fontSize: 16, fontWeight: '600' },
  botonEliminar: { width: 96, backgroundColor: '#ff5b5b', justifyContent: 'center', alignItems: 'center', height: '100%' },
});