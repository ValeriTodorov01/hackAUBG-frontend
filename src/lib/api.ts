import { type Reading, PROPERTY_MAP } from '@/lib/types';
import { SatelliteData, SatelliteCommand } from './types';

const mockSatelliteData: SatelliteData = {
	status: 'online',
	position: {
		latitude: 32.7157,
		longitude: -117.1611,
		altitude: 408.5,
	},
	orientation: {
		sunAxisRotation: 145.2,
		earthAxisRotation: 78.9,
	},
	power: {
		batteryPercentage: 87,
		solarPanelStatus: 'active',
		powerConsumption: 120,
	},
	events: [
		{
			id: 'evt-1234567890',
			type: 'Wildfire',
			severity: 'high',
			location: 'California, USA',
			description:
				'Large wildfire detected in Northern California forest region, spreading rapidly due to high winds.',
			timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
			coordinates: {
				latitude: '38.8025',
				longitude: '-122.9586',
			},
			imageUrl: '/placeholder.svg?height=300&width=400',
			isNew: true,
		},
		{
			id: 'evt-0987654321',
			type: 'Flood',
			severity: 'medium',
			location: 'Mississippi River, USA',
			description:
				'Flooding detected along Mississippi River basin affecting several communities.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
			coordinates: {
				latitude: '29.9511',
				longitude: '-90.0715',
			},
			imageUrl: '/placeholder.svg?height=300&width=400',
			isNew: false,
		},
		{
			id: 'evt-5678901234',
			type: 'Hurricane',
			severity: 'high',
			location: 'Gulf of Mexico',
			description:
				'Category 3 hurricane forming in the Gulf of Mexico, moving northwest at 15 mph.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
			coordinates: {
				latitude: '25.7617',
				longitude: '-80.1918',
			},
			imageUrl: '/placeholder.svg?height=300&width=400',
			isNew: true,
		},
		{
			id: 'evt-2468013579',
			type: 'Storm',
			severity: 'low',
			location: 'North Atlantic',
			description:
				'Tropical storm system developing with sustained winds of 45 mph.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
			coordinates: {
				latitude: '32.3113',
				longitude: '-64.7505',
			},
			imageUrl: '/placeholder.svg?height=300&width=400',
			isNew: false,
		},
		{
			id: 'evt-1357924680',
			type: 'Wildfire',
			severity: 'medium',
			location: 'Australia',
			description:
				'Bushfire detected in eastern Australia affecting approximately 500 hectares.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
			coordinates: {
				latitude: '-33.8688',
				longitude: '151.2093',
			},
			imageUrl: '/placeholder.svg?height=300&width=400',
			isNew: false,
		},
	],
};

export async function fetchSatelliteData(): Promise<SatelliteData> {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// return fetch('/api/satellite').then(res => res.json())

	return {
		...mockSatelliteData,
		position: {
			...mockSatelliteData.position,
			latitude:
				mockSatelliteData.position.latitude +
				(Math.random() * 0.2 - 0.1),
			longitude:
				mockSatelliteData.position.longitude +
				(Math.random() * 0.2 - 0.1),
		},
		power: {
			...mockSatelliteData.power,
			batteryPercentage: Math.min(
				100,
				Math.max(
					0,
					mockSatelliteData.power.batteryPercentage +
						(Math.random() * 2 - 1)
				)
			),
		},
	};
}

export async function sendSatelliteCommand(
	command: SatelliteCommand
): Promise<{ success: boolean }> {
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// return fetch('/api/satellite/command', {
	//   method: 'POST',
	//   headers: { 'Content-Type': 'application/json' },
	//   body: JSON.stringify(command)
	// }).then(res => res.json())

	console.log('Command sent to satellite:', command);

	if (Math.random() < 0.1) {
		throw new Error('Command failed: Connection timeout');
	}

	return { success: true };
}

const API_ENDPOINT =
	'http://localhost:8080/services/ts/nst-one/gen/edm/api/entities/ReadingService.ts';

/**
 * Fetches the latest readings from the API
 * @returns Promise with the latest readings for each property
 */
export async function fetchLatestReadings(): Promise<Record<string, Reading>> {
	try {
		const response = await fetch(API_ENDPOINT, {
			headers: {
				Authorization: 'Basic ' + btoa('admin:admin'),
			},
		});

		if (!response.ok) {
			throw new Error(
				`API request failed with status ${response.status}`
			);
		}
		const data: Reading[] = await response.json();

		const latestReadings: Record<string, Reading> = {};

		const sortedData = [...data].sort((a, b) => b.Id - a.Id);

		sortedData.forEach((reading) => {
			const propertyName = PROPERTY_MAP[reading.Property];

			if (!propertyName) return;

			if (
				!latestReadings[propertyName] ||
				new Date(reading.Timestamp) >
					new Date(latestReadings[propertyName].Timestamp)
			) {
				latestReadings[propertyName] = reading;
			}
		});

		return latestReadings;
	} catch (error) {
		console.error('Error fetching readings:', error);
		return getMockReadings();
	}
}

function getMockReadings(): Record<string, Reading> {
	const now = new Date().toISOString();

	return {
		temperature: {
			Id: 1,
			Property: 1,
			Value: 22 + Math.random() * 8,
			Timestamp: now,
		},
		humidity: {
			Id: 2,
			Property: 2,
			Value: 45 + Math.random() * 30,
			Timestamp: now,
		},
		lat: {
			Id: 3,
			Property: 3,
			Value: 37.7749 + (Math.random() - 0.5) * 2,
			Timestamp: now,
		},
		long: {
			Id: 4,
			Property: 4,
			Value: -122.4194 + (Math.random() - 0.5) * 2,
			Timestamp: now,
		},
	};
}
