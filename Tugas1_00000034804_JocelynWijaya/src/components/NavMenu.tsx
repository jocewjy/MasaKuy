import { IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonLabel, IonIcon } from '@ionic/react';
import React from 'react';
import './Nav.css';
import { homeOutline, homeSharp, helpCircleOutline, helpCircleSharp, settingsOutline, settingsSharp, discOutline, discSharp } from 'ionicons/icons';

export const NavMenu = () => {
	return (
        <IonMenu side='start' contentId='main'>
			<IonContent>
				<IonList>
					<IonMenuToggle>
						<IonItem button routerLink={'/home'} routerDirection='none' lines='none'>
							<IonIcon ios={homeOutline} md={homeSharp}></IonIcon>
							<IonLabel className='home'>Home</IonLabel>
						</IonItem>

						<IonItem button routerLink={'/page-1'} routerDirection='none' lines='none'>
							<IonIcon ios={discOutline} md={discSharp}></IonIcon>
							<IonLabel className='disc'>Tips & Trick</IonLabel>
						</IonItem>

						<IonItem button routerLink={'/page-2'} routerDirection='none' lines='none'>
							<IonIcon ios={helpCircleOutline} md={helpCircleSharp}></IonIcon>
							<IonLabel className='help'>Help & Support</IonLabel>
						</IonItem>

						<IonItem button routerLink={'/page-2'} routerDirection='none' lines='none'>
							<IonIcon ios={settingsOutline} md={settingsSharp}></IonIcon>
							<IonLabel className='setting'>Settings</IonLabel>
						</IonItem>
					</IonMenuToggle>
				</IonList>
			</IonContent>
		</IonMenu>
	);
};