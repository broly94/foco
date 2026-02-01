import { Atom, OrbitProgress } from 'react-loading-indicators';
/* 
| OR directly pull it 😎
| import Atom from "react-loading-indicators/Atom";
*/ //<OrbitProgress color={['#949b94', '#94979b', '#9b949b', '#9b9794']} />;

const Loading = () => (
	<OrbitProgress
		variant='track-disc'
		size='small'
		speedPlus={-2}
		easing='ease-in-out'
		color={['#949b94', '#94979b', '#9b949b', '#9b9794']}
	/>
);

export default Loading;
