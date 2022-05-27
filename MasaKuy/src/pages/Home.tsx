import {
	IonButton,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonImg,
	IonLabel,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar,
	NavContext,
} from '@ionic/react';
import { useCallback, useContext, useEffect } from 'react';
import { getCurrUser } from '../FirebaseConfig';
import './Home.css';

const Home: React.FC = () => {

	const { navigate } = useContext(NavContext);

	const redirect = useCallback(
		() => navigate('/mainmenu', 'forward'),
		[navigate]
	);

	useEffect(() => {
		getCurrUser().then(user => {
			if (user) {
				redirect();
			}
		});
	}, []);

	return (
		<IonPage>
			<IonHeader></IonHeader>
			<IonContent fullscreen color='primary'>
				<IonHeader collapse='condense'>
					<IonToolbar></IonToolbar>
				</IonHeader>
				<div className='home-vertical-center'>
					<div className='center'>
						<IonImg
							className='ion-align-self-end logoPeach'
							src='assets/Logo/logoPeach.png'
						/>
					</div>
				</div>
				<IonGrid>
					<IonRow>
						<IonCol class='ion-text-center'>
							<IonButton className='home-button' color='secondary' routerLink='/Login'>
								<IonLabel>LOGIN</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol class='ion-text-center'>
							<IonButton className='home-button' color='secondary' routerLink='/Signup'>
								<IonLabel>SIGN UP</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Home;
