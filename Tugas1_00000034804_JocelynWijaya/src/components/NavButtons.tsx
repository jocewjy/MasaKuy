import { IonButton, IonMenuButton } from '@ionic/react';
import React, { useEffect } from 'react';

export const NavButtons = () => {
	const [mQuery, setMQuery] = React.useState<any>({
		matches: window.innerWidth > 400 ? true : false,
	});

	useEffect(() => {
		let mediaQuery = window.matchMedia('(min-width: 0px)');
		mediaQuery.addListener(setMQuery);

		return () => mediaQuery.removeListener(setMQuery);
	}, []);

	console.log(mQuery.matches);

	return (
		<div>
			{mQuery && !mQuery.matches ? (
				<IonMenuButton />
			) : (
				<>
					<IonButton routerLink={'/home'}>Home </IonButton>
					<IonButton routerLink={'/page-1'}>Tips & Trick </IonButton>
					<IonButton routerLink={'/page-2'}>Help & Support</IonButton>
					<IonButton routerLink={'/page-2'}>Settings</IonButton>
				</>
			)}
		</div>
	);
};