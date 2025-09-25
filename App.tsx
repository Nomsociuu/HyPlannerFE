import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { PaperProvider } from "react-native-paper";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { SelectionProvider } from "./src/contexts/SelectionContext";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Agbalumo: require("./assets/fonts/Agbalumo-Regular.ttf"),
      "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
      "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
      "Gwendolyn-Regular": require("./assets/fonts/Gwendolyn-Regular.ttf"),
      // ...các font khác
    }).then(() => setFontsLoaded(true));
  }, []);
  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <Provider store={store}>
          {/* THÊM PersistGate Ở ĐÂY */}
          <PersistGate loading={null} persistor={persistor}>
            <SelectionProvider>
              <AppNavigator />
            </SelectionProvider>
          </PersistGate>
        </Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
