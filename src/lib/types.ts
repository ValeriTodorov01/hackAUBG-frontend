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
