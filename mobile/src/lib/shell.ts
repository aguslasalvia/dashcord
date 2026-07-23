import { Linking } from "react-native";

// Opens a URL outside the app (e.g. a YouTube link) in the phone's browser
// or the YouTube app, whichever handles it.
export const openExternal = async (url: string) => {
  await Linking.openURL(url);
};
