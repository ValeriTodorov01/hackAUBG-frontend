/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';

const CameraStream = () => {
	const [streamError, setStreamError] = useState(false);

	const handleError = () => {
		setStreamError(true);
	};

	return (
		<div style={{ width: '100%', height: '100%' }}>
			{streamError ? (
				<video
					src='alt-stream.mp4'
					autoPlay
					loop
					muted
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
				/>
			) : (
				<img
					// src='http://localhost:81/stream'
					src='http://192.168.84.192:7123/stream'
					alt='ESP32 Camera Stream'
					onError={handleError}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
				/>
			)}
		</div>
	);
};

export default CameraStream;
