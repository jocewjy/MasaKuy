import {
	IonBackButton,
	IonButton,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonImg,
	IonInput,
	IonLabel,
	IonPage,
	IonRow,
	IonText,
	IonToast,
	IonToolbar,
	NavContext,
} from '@ionic/react';
import { useCallback, useContext, useEffect, useState } from 'react';

import './Login.css';

import { getCurrUser, loginUser } from '../FirebaseConfig';
import { useHistory } from 'react-router';

const Login: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [toastMessage, setToastMessage] = useState('');
	const history = useHistory();

	async function login() {
		if (email === '') {
			return setToastMessage('Email must be filled');
		}

		if (password === '') {
			return setToastMessage('Password must be filled');
		}

		const res = await loginUser(email, password);

		if (res) {
			setToastMessage('You have logged in');
		} else {
			setToastMessage('Failed login, wrong password or user not found');
			return;
		}

		onClickReset();
		history.replace('/MainMenu');
	}

	const onClickReset = () => {
		setEmail('');
		setPassword('');
	};

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
			<IonToast
				isOpen={!!toastMessage}
				message={toastMessage}
				duration={2000}
				onDidDismiss={() => {
					setToastMessage('');
				}}
			/>
			<IonHeader></IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse='condense'>
					<IonToolbar></IonToolbar>
				</IonHeader>
				<div className='login-vertical-center'>
					<div className='center'>
						<IonImg
							className='ion-align-self-end logoBlue'
							src='assets/Logo/logoBlue.png'
						/>
					</div>
				</div>
				<div className='width80'>
					<IonText color='medium' class='ion-text-center full-width'>
						<div className='login-divider-line'>
							<span className='divider-line-title'>L O G I N</span>
						</div>
					</IonText>
				</div>

				<IonGrid className='width80'>
					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Email</IonLabel>
							</IonRow>
							<IonRow>
								<IonInput
									className='login-input'
									value={email}
									onIonChange={(e: any) => setEmail(e.target.value)}
								></IonInput>
							</IonRow>
						</IonCol>
					</IonRow>
					<IonRow className='ion-padding-bottom'>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Password</IonLabel>
							</IonRow>
							<IonRow>
								<IonInput
									className='login-input'
									value={password}
									type='password'
									onIonChange={(e: any) => setPassword(e.target.value)}
								></IonInput>
							</IonRow>
						</IonCol>
					</IonRow>

					<IonRow className='ion-padding-top'>
						<IonCol class='ion-text-center'>
							<IonButton className='login-button' color='primary' onClick={login}>
								<IonLabel>LOGIN</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol class='ion-text-center'>
							<IonButton
								className='login-button'
								color='secondary'
								routerLink='/Home'
								onClick={onClickReset}
							>
								<IonLabel>CANCEL</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Login;
