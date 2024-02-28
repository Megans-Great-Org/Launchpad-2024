export interface WeatherInfoJsonInterface {
  [key: string]: {
    day: {
      description: string;
      image: string;
    };
    night: {
      description: string;
      image: string;
    };
    designNumber: number;
  };
}

export interface WeatherDesignJsonInterface {
  [key: string]: {
    image: string;
    colour: string;
    blendColour: string;
  };
}
