export interface SatelliteData {
	status: 'online' | 'offline';
	position: SatellitePosition;
	orientation: {
		sunAxisRotation: number;
		earthAxisRotation: number;
	};
	power: {
		batteryPercentage: number;
		solarPanelStatus: 'active' | 'inactive' | 'charging';
		powerConsumption: number;
	};
	events: NaturalEvent[];
}

export interface SatellitePosition {
	latitude: number;
	longitude: number;
	altitude: number;
}

export interface NaturalEvent {
	id: string;
	type: string;
	severity: 'low' | 'medium' | 'high';
	location: string;
	description: string;
	timestamp: string;
	coordinates: {
		latitude: string;
		longitude: string;
	};
	imageUrl?: string;
	isNew: boolean;
}

export interface SatelliteCommand {
	type: string;
	params: Record<string, unknown>;
}

// Reading types
export interface Reading {
	Id: number;
	Property: number;
	Value: number;
	Timestamp: string;
}

export interface PropertyDefinition {
	Id: number;
	Name: string;
}

export const PROPERTY_MAP: Record<number, string> = {
	1: 'temperature',
	2: 'humidity',
	3: 'lat',
	4: 'long',
};

export const PROPERTY_NAME_TO_ID: Record<string, number> = {
	temperature: 1,
	humidity: 2,
	lat: 3,
	long: 4,
};

export const PROPERTY_UNITS: Record<string, string> = {
	temperature: '°C',
	humidity: '%',
	lat: '°',
	long: '°',
};

export const PROPERTY_COLORS: Record<string, { text: string; bg: string }> = {
	temperature: { text: 'text-red-500', bg: 'bg-red-100' },
	humidity: { text: 'text-blue-500', bg: 'bg-blue-100' },
	lat: { text: 'text-green-500', bg: 'bg-green-100' },
	long: { text: 'text-purple-500', bg: 'bg-purple-100' },
};

export const PROPERTY_MAX_VALUES: Record<string, number> = {
	temperature: 250, // Max temperature in Celsius
	humidity: 100, // Max humidity percentage
	lat: 90, // Max latitude
	long: 180, // Max longitude
};
