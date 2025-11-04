import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ProveedorTema } from './tema/ContextoTema';
import PantallaInicio from './pantallas/PantallaInicio';
import PantallaEjercicios from './pantallas/PantallaEjercicios';
import InterruptorModo from './Componentes/InterruptorModo';

const Pila = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProveedorTema>
        <Navegacion />
      </ProveedorTema>
    </GestureHandlerRootView>
  );
}

function Navegacion() {
  const usarOscuro = false;
  return (
    <NavigationContainer theme={usarOscuro ? DarkTheme : DefaultTheme}>
      <Pila.Navigator initialRouteName="Inicio">
        <Pila.Screen
          name="Inicio"
          component={PantallaInicio}
          options={{ title: 'Inicio', headerRight: () => <InterruptorModo /> }}
        />
        <Pila.Screen
          name="Ejercicios"
          component={PantallaEjercicios}
          options={{
            title: 'Ejercicios 🏋️‍♀️',
            headerRight: () => <InterruptorModo />,
            gestureEnabled: false,
          }}
        />
      </Pila.Navigator>
    </NavigationContainer>
  );
}
