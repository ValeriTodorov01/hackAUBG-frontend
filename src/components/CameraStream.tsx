/* eslint-disable @next/next/no-img-element */
const CameraStream = () => {
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<img
				src={'http://localhost:81/stream'}
				alt='ESP32 Camera Stream'
				style={{
					objectFit: 'contain',
				}}
			/>
		</div>
	);
};

export default CameraStream;
