// These describe which screens exist in each navigator and what params
// (if any) they expect, so React Navigation can type-check navigate() calls.

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Library: undefined;
  Discover: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Playlist: { id: string; name?: string };
};
