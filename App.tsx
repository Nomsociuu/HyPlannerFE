import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { PaperProvider } from "react-native-paper";
import * as Font from 'expo-font';
import { Provider } from "react-redux";
import { store } from "./src/store";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Agbalumo': require('./assets/fonts/Agbalumo-Regular.ttf'),
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
      'Gwendolyn-Regular': require('./assets/fonts/Gwendolyn-Regular.ttf'),
      // ...các font khác
    }).then(() => setFontsLoaded(true));
  }, []);
  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
