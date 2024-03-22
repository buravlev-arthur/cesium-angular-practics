export type Label = {
  text: string;
  position: [string, string];
  display: 'block' | 'none';
  coords: [number, number];
  backgroundColor: string;
  fontColor: string;
};

export type Params = {
  longitude: number;
  latitude: number;
  text: string;
  backgroundColor: string;
  fontColor: string;
};
