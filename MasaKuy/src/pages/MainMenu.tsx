import {
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonFab,
	IonFabButton,
	IonGrid,
	IonHeader,
	IonIcon,
	IonImg,
	IonPage,
	IonRow,
	IonSearchbar,
	IonText,
	IonTitle,
	IonToast,
	IonToolbar,
} from '@ionic/react';
import {
	add,
	person,
	personCircle,
	pricetag,
	star,
} from 'ionicons/icons';
import { useEffect, useState } from 'react';

import { collection, getFirestore, getDocs, orderBy, query } from "firebase/firestore";

import './MainMenu.css';
import { useHistory } from 'react-router';

const MainMenu: React.FC = () => {
	const history = useHistory();

	const searchRecipeHandler = () => {
		history.replace('/search');
	}
	const [toastMessage, setToastMessage] = useState('');

	const db = getFirestore();

	const [recipes, setRecipes] = useState<Array<any>>([]);
	const [users, setUsers] = useState<Array<any>>([]);

	useEffect(() => {
		async function getUserData() {
			const querySnapshotUser = await getDocs(collection(db, "user"));

			console.log("querySnapshotUser: ", querySnapshotUser);

			setUsers(querySnapshotUser.docs.map((doc) => ({
				...doc.data(),
				id: doc.id
			})));

			querySnapshotUser.forEach((doc) => {
				console.log(`${doc.id} => ${doc.data()}`);
				console.log("doc: ", doc);
			});
		}

		getUserData();
	}, []);

	useEffect(() => {
		async function getData() {
			const querySnapshot = await getDocs(query(collection(db, "recipes"), orderBy("avgRating", "desc")));

			console.log("querySnapshot: ", querySnapshot);

			setRecipes(querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
				uname: users[users.findIndex((u) => u.email === doc.data().uemail)].username
			})));

			querySnapshot.forEach((doc) => {
				console.log(`${doc.id} => ${doc.data()}`);
				console.log("doc: ", doc);
			});
		};

		getData();
	}, [users]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonSearchbar
						onIonFocus={searchRecipeHandler}
						placeholder='Cari resep...'
						color='tertiary'
					></IonSearchbar>

					<IonToast
						isOpen={!!toastMessage}
						message={toastMessage}
						duration={2000}
						onDidDismiss={() => {
							setToastMessage('');
						}}
					/>
					<IonButtons slot='end'>
						<IonButton routerLink='/profile'>
							<IonIcon icon={personCircle} slot='icon-only'></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<div className='mainmenu-vertical-center'>
					<div className='center'>
						<IonImg
							className='ion-align-self-end logoBlue'
							src='assets/Logo/logoBlue.png'
						/>
					</div>
				</div>
				<div className='width80'>
					<IonText color='medium' class='ion-text-center full-width'>
						<div className='mainmenu-divider-line'>
							<span className='divider-line-title'>Resep Populer</span>
						</div>
					</IonText>
				</div>

				<IonGrid className='width90'>
					{(!recipes || recipes.length <= 0) && (
						<IonRow>
							<IonCol className="ion-text-center">
								<IonTitle color="primary">Tidak ada resep ditemukan.</IonTitle>
							</IonCol>
						</IonRow>
					)}

					{recipes && recipes.map(recipe => (
						<IonRow className='resep' key={recipe.id}>
							<IonButton color="secondary" class="hidden-button" routerLink={`/post/${recipe.id}`}>
								<IonCol className='width50'>
									<img
										src={recipe.photoUrl}
										className='menuimage'
									></img>
								</IonCol>
								<IonCol className='menutext width50'>
									<p><h3 className='one-line'>{recipe.title}</h3></p>
									<p className='one-line'><i>{recipe.description}</i></p>
									<br />

									<p className='one-line'>
										<small>
											<IonIcon icon={person} slot='start' /> &nbsp;
											{recipe.uname}
										</small>
									</p>

									<p className='one-line'>
										<small>
											<IonIcon icon={pricetag} slot='start' /> &nbsp;
											{recipe.type}
										</small>
									</p>

									<p className='one-line'>
										<small>
											<IonIcon icon={star} slot='start' /> &nbsp;
											{recipe.avgRating == -1 ?
												<>Belum dinilai</>
												:
												<>{recipe.avgRating.toFixed(1)}</>
											}
										</small>
									</p>
								</IonCol>
							</IonButton>
						</IonRow>
					))}
				</IonGrid>

				<IonFab vertical='bottom' horizontal='end' slot='fixed'>
					<IonFabButton routerLink='/PostRecipe'>
						<IonIcon icon={add} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
};

export default MainMenu;
