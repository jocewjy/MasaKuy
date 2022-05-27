import {
	IonAlert,
	IonBackButton,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonImg,
	IonModal,
	IonPage,
	IonRow,
	IonText,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import {
	personCircle,
	home,
	star,
	pricetag,
	starOutline,
} from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';

import { collection, getFirestore, getDocs, doc, getDoc, query, where, addDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";

import './RecipeDetail.css';
import { useHistory, useParams } from 'react-router';
import { getAuth } from 'firebase/auth';

const RecipeDetail: React.FC = () => {
	const auth = getAuth();
	const [description, setDescription] = useState('');
	const [ingredients, setIngredients] = useState('');
	const [photoUrl, setPhotoUrl] = useState('');
	const [steps, setSteps] = useState('');
	const [title, setTitle] = useState('');
	const [type, setType] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [fotoUser, setFotoUser] = useState('');
	const [rate, setRate] = useState('');
	const [userRating, setUserRating] = useState(-1);
	const [startDeleting, setStartDeleting] = useState(false);

	const [startRating, setStartRating] = useState(false);
	const [currUserRating, setCurrUserRating] = useState(-1);
	const [tmpUserRating, setTmpUserRating] = useState(-1);

	const startRatingHandler = async () => {
		const ratings = collection(db, "ratings");
		const q = query(ratings, where("email", "==", auth.currentUser?.email), where("recipeid", "==", rId));

		const querySnapshot = await getDocs(q);

		if (querySnapshot.size != 0) {
			querySnapshot.forEach((doc) => {
				console.log(doc.id);
				setCurrUserRating(doc.data().rating);
			});
		}
		setStartRating(true);
	}

	const cancelUserRatingHandler = async () => {
		const ratings = collection(db, "ratings");
		const q = query(ratings, where("email", "==", auth.currentUser?.email), where("recipeid", "==", rId));

		const querySnapshot = await getDocs(q);

		if (querySnapshot.size != 0) {
			querySnapshot.forEach((doc) => {
				console.log(doc.id);
				setTmpUserRating(doc.data().rating);
			});
		}

		setCurrUserRating(tmpUserRating);
		setStartRating(false);
	}

	const saveUserRatingHandler = () => {
		setUserRating(currUserRating);
		setStartRating(false);
	}

	const viewDetailBtnRef = useRef<HTMLIonButtonElement>(null);

	const history = useHistory();
	const db = getFirestore();

	const startDeletingHandler = () => {
		setStartDeleting(true);
	}

	const deleteRecipeHandler = async () => {
		await deleteDoc(doc(db, 'recipes', rId));

		const q = query(collection(db, "comments"), where("id", "==", rId));
		const querySnapshot = await getDocs(q);
		const batch = writeBatch(db);

		querySnapshot.forEach((doc) => {
			batch.delete(doc.ref);
		});

		await batch.commit();

		const q2 = query(collection(db, "ratings"), where("recipeid", "==", rId));
		const querySnapshot2 = await getDocs(q2);
		const batch2 = writeBatch(db);

		querySnapshot2.forEach((doc) => {
			batch2.delete(doc.ref);
		});

		await batch2.commit();

		setStartDeleting(false);
		history.replace('/mainmenu');
	}

	const rId = useParams<{ recipeId: string }>().recipeId;

	useEffect(() => {
		getTotalRating();
		getData();
	}, []);

	useEffect(() => {
		getUsername();
	}, [email])

	const getData = async () => {
		const recipes = doc(db, 'recipes', rId);
		const docSnap = await getDoc(recipes);

		if (docSnap.exists()) {
			setDescription(docSnap.data().description);
			setIngredients(decodeURI(docSnap.data().ingredients));
			setPhotoUrl(docSnap.data().photoUrl);
			setSteps(decodeURI(docSnap.data().steps));
			setTitle(docSnap.data().title);
			setType(docSnap.data().type);
			setEmail(docSnap.data().uemail);
			setRate(docSnap.data().avgRating);
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
		}
	};

	const getUsername = async () => {
		const user = collection(db, "user");
		const q = query(user, where("email", "==", email));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			setUsername(doc.data().username);
			setFotoUser(doc.data().fotoUrl);
		});
	}

	//Post/Update Rating Methods
	const postRating = async () => {
		try {
			const docRef = await addDoc(collection(db, 'ratings'), {
				email: auth.currentUser?.email,
				rating: userRating,
				recipeid: rId
			});
			console.log('Document written with ID: ', docRef.id);
			await getTotalRating();
			history.go(0);
		} catch (e) {
			console.error('Error adding document: ', e);
		}
	}

	const updateRating = async (uid: string) => {
		const ratings = doc(db, "ratings", uid);

		await updateDoc(ratings, {
			rating: userRating
		});

		await getTotalRating();
		history.go(0);
	};

	const getUserRating = async () => {
		const ratings = collection(db, "ratings");
		const q = query(ratings, where("email", "==", auth.currentUser?.email), where("recipeid", "==", rId));

		const querySnapshot = await getDocs(q);

		if (querySnapshot.size === 0) {
			console.log("New Rating");
			postRating();
		}
		else {
			console.log("Update Rating")
			querySnapshot.forEach((doc) => {
				console.log(doc.id);
				updateRating(doc.id);
			});
		}
	}

	useEffect(() => {
		if (userRating === -1)
			return;

		console.log("Rating:" + userRating);
		getUserRating();
		// postRating()
	}, [userRating]);

	//Get&Calculate Rating Method
	const getTotalRating = async () => {
		const ratings = collection(db, "ratings");
		const q = query(ratings, where("recipeid", "==", rId));
		var totalRating = 0;

		const querySnapshot = await getDocs(q);
		if (querySnapshot.size === 0) {
			return;
		}
		querySnapshot.forEach((doc) => {
			totalRating += +doc.data().rating;
		});

		var avgRating = totalRating / querySnapshot.size;

		updateRecipeRating(avgRating);
	}

	const updateRecipeRating = async (avgRating: number) => {
		const recipes = doc(db, "recipes", rId);

		await updateDoc(recipes, {
			avgRating: avgRating
		});
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref='/MainMenu'></IonBackButton>
					</IonButtons>

					<IonButtons slot='end'>
						<IonButton href='/mainmenu'>
							<IonIcon icon={home} slot='icon-only'></IonIcon>
						</IonButton>
						<IonButton href='/profile'>
							<IonIcon icon={personCircle} slot='icon-only'></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonImg className='recipe-img' src={photoUrl}></IonImg>

				{auth.currentUser?.email === email ?
					<IonButton class="deleteRecipeBtn" color='danger' onClick={startDeletingHandler}>Hapus Resep</IonButton>
					:
					<></>
				}

				<IonAlert
					isOpen={startDeleting}
					header="Apakah Anda yakin mau menghapus unggahan resep ini?"
					message="Apabila dihapus, unggahan resep tidak dapat direstorasi kembali."
					buttons={[
						{ text: 'Tidak', role: 'cancel', handler: () => { setStartDeleting(false) } },
						{ text: 'Ya', handler: deleteRecipeHandler }
					]}
				/>

				<IonModal
					isOpen={startRating}
					class="ratingModal"
				>
					<IonCol class='modalContent'>
						<IonRow class='ion-padding'>
							<IonButtons class='modalButtons'>
								{currUserRating < 1 ? <IonIcon icon={starOutline} size="large" color='primary' onClick={() => setCurrUserRating(1)} /> : <IonIcon icon={star} size="large" color='primary' onClick={() => setCurrUserRating(1)} />}
								{currUserRating < 2 ? <IonIcon icon={starOutline} size="large" color='primary' onClick={() => setCurrUserRating(2)} /> : <IonIcon icon={star} size="large" color='primary' onClick={() => setCurrUserRating(2)} />}
								{currUserRating < 3 ? <IonIcon icon={starOutline} size="large" color='primary' onClick={() => setCurrUserRating(3)} /> : <IonIcon icon={star} size="large" color='primary' onClick={() => setCurrUserRating(3)} />}
								{currUserRating < 4 ? <IonIcon icon={starOutline} size="large" color='primary' onClick={() => setCurrUserRating(4)} /> : <IonIcon icon={star} size="large" color='primary' onClick={() => setCurrUserRating(4)} />}
								{currUserRating < 5 ? <IonIcon icon={starOutline} size="large" color='primary' onClick={() => setCurrUserRating(5)} /> : <IonIcon icon={star} size="large" color='primary' onClick={() => setCurrUserRating(5)} />}
							</IonButtons>
						</IonRow>

						<IonRow>
							<IonButtons class='modalButtons ion-padding'>
								<IonButton class='modalBtn' color='secondary' fill='outline' onClick={cancelUserRatingHandler}>Batal</IonButton>
								<IonButton class='modalBtn' color='primary' fill='solid' onClick={saveUserRatingHandler}>Simpan</IonButton>
							</IonButtons>
						</IonRow>
					</IonCol>
				</IonModal>

				<IonGrid className='width95'>
					<IonRow className='width95'>
						<IonText color='primary' className='recipeDetail-title'>{title}</IonText>
					</IonRow>
					<IonRow>
						<IonCol size='3'>
							<IonImg className='rDetail-user-img' src={fotoUser}></IonImg>
						</IonCol>
						<IonCol className='rDetail-username'>
							<p>{username}</p>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol size='3' class='ion-text-center'>
							<IonIcon color="primary" icon={pricetag} size="large" />
						</IonCol>
						<IonCol>
							<div className='recipedetail-cat'>{type}</div>
						</IonCol>
					</IonRow>

					<IonRow >
						{rate == '-1' ?
							<>
								<IonCol class='topBottomAuto ion-text-center' size='3'>
									<IonIcon icon={starOutline} size='large' color='primary' />
								</IonCol>
								<IonCol class='topBottomAuto ion-text-left'>
									<div className='topBottomAuto rate-num'>Belum dinilai</div>
								</IonCol>
							</>
							:
							<>
								<IonCol class='topBottomAuto ion-text-center' size='3'>
									<IonIcon icon={star} size='large' color='primary' />
								</IonCol>

								<IonCol class='topBottomAuto ion-text-left'>
									<div className='topBottomAuto rate-num'>{parseFloat(rate).toFixed(1)}</div>
								</IonCol>
							</>
						}
					</IonRow>

					<IonRow className='recipedetail-desc ion-padding-top ion-padding-bottom'>
						{description}
					</IonRow>
				</IonGrid>

				<div className='recipedetail-divider-line'></div>
				<div className='width85'>
					<IonText color='medium' class='ion-text-center full-width'>
						<div className='recipedetail-divider-line'>
							<span className='recipedetail-line-title'>Alat dan Bahan</span>
						</div>
					</IonText>

					<IonRow className='recipedetail-text'>
						<p className='preWrapSpace'>{ingredients}</p>
					</IonRow>

					<IonText color='medium' class='ion-text-center full-width'>
						<div className='recipedetail-divider-line'>
							<span className='recipedetail-line-title'>Cara Memasak</span>
						</div>
					</IonText>

					<IonRow className='recipedetail-text'>
						<p className='preWrapSpace'>{steps}</p>
					</IonRow>

					<IonRow class="ion-text-center recipedetail-btn ">
						<IonCol>
							<IonButton className='commentButton recipe-btn' onClick={startRatingHandler}>Beri Nilai</IonButton>
						</IonCol>
					</IonRow>

					<IonRow class="ion-text-center ion-padding-bottom">
						<IonCol>
							<IonButton routerLink={`/commentrecipe/${rId}`} className='commentButton recipe-btn'>Lihat komentar</IonButton>
						</IonCol>
					</IonRow>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default RecipeDetail;
