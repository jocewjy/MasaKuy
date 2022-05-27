import {
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
import { useHistory } from 'react-router';
import './Signup.css';

import { getCurrUser, signupUser } from '../FirebaseConfig';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

const Signup: React.FC = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [phonenumber, setPhonenumber] = useState('');
	const [password, setPassword] = useState('');
	const [repassword, setRepassword] = useState('');
	const [toastMessage, setToastMessage] = useState('');
	const history = useHistory();
	const db = getFirestore();

	async function signup() {
		if (password != repassword) {
			return setToastMessage('password not match');
		}
		if (
			username.trim() === '' ||
			email.trim() === '' ||
			phonenumber.trim() === '' ||
			password.trim() === '' ||
			repassword.trim() === ''
		) {
			// return toast('all field must not be empty')
			return setToastMessage('all field must not be empty');
		}

		const res = await signupUser(username, email, phonenumber, password);

		if (res) {
			setToastMessage('Registered successfully');
		}
		else {
			return setToastMessage('Register failed, email has been used')
		}

		//Register Success
		addData();
		onClickReset();

		history.replace('/login');
	}

	const onClickReset = () => {
		setUsername('');
		setEmail('');
		setPhonenumber('');
		setPassword('');
		setRepassword('');
	};

	const addData = async () => {
		try {
			const docRef = await addDoc(collection(db, 'user'), {
				username: username,
				email: email,
				phonenumber: phonenumber,
				foto: '',
				fotoUrl: '',
			});

			console.log('Document written with ID: ', docRef.id);
		} catch (e) {
			console.error('Error adding document: ', e);
		}
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
				<div className='signup-vertical-center'>
					<div className='center'>
						<IonImg
							className='ion-align-self-end logoBlue'
							src='assets/Logo/logoBlue.png'
						/>
					</div>
				</div>
				<div className='width80'>
					<IonText color='medium' class='ion-text-center full-width'>
						<div className='signup-divider-line'>
							<span className='divider-line-title'>S I G N &nbsp; U P</span>
						</div>
					</IonText>
				</div>

				<IonGrid className='width80'>
					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Username</IonLabel>
							</IonRow>
							<IonRow>
								<IonInput
									className='signup-input'
									value={username}
									onIonChange={(e: any) => setUsername(e.target.value)}
								></IonInput>
							</IonRow>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Email</IonLabel>
							</IonRow>
							<IonRow>
								<IonInput
									className='signup-input'
									value={email}
									onIonChange={(e: any) => setEmail(e.target.value)}
								></IonInput>
							</IonRow>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Phone Number</IonLabel>
							</IonRow>
							<IonRow>
								<IonInput
									className='signup-input'
									type='number'
									value={phonenumber}
									onIonChange={(e: any) => setPhonenumber(e.target.value)}
								></IonInput>
							</IonRow>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Password</IonLabel>
							</IonRow>
							<IonRow>
								<IonInput
									className='signup-input'
									value={password}
									type='password'
									onIonChange={(e: any) => setPassword(e.target.value)}
								></IonInput>
							</IonRow>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Confirm Password</IonLabel>
							</IonRow>
							<IonRow>
								<IonInput
									className='signup-input'
									value={repassword}
									type='password'
									onIonChange={(e: any) => setRepassword(e.target.value)}
								></IonInput>
							</IonRow>
						</IonCol>
					</IonRow>

					<IonRow className='ion-padding-top'>
						<IonCol class='ion-text-center'>
							<IonButton color='primary' class='signup-button'>
								<IonLabel onClick={signup}>SIGN UP</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol class='ion-text-center'>
							<IonButton
								color='secondary'
								routerLink='/Home'
								onClick={onClickReset}
								class='signup-button'
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

export default Signup;
