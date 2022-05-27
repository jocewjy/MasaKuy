import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonImg,
	IonInput,
	IonLabel,
	IonPage,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonText,
	IonTextarea,
	IonToolbar,
} from '@ionic/react';
import {
	camera,
	home,
	image,
	personCircle,
} from 'ionicons/icons';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router';

import { base64FromPath } from "@ionic/react-hooks/filesystem";

import { collection, addDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth } from 'firebase/auth';

import './PostRecipe.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const PostRecipe: React.FC = () => {
	const history = useHistory();

	const storage = getStorage();
	const db = getFirestore();

	const auth = getAuth();

	const titleRef = useRef<HTMLIonInputElement>(null);
	const descRef = useRef<HTMLIonTextareaElement>(null);
	const ingRef = useRef<HTMLIonTextareaElement>(null);
	const stepsRef = useRef<HTMLIonTextareaElement>(null);

	const [chosenRecipeType, setChosenRecipeType] = useState<'Makanan Pembuka' | 'Makanan Utama' | 'Makanan Penutup' | 'Camilan' | 'Minuman'>('Makanan Utama');
	
	const [isPhotoTaken, setIsPhotoTaken] = useState(false);

	const [takenPhoto, setTakenPhoto] = useState<{
		path: string | undefined; // will store original URL
		preview: string; // will store preview URL for web
	}>();

	const selectRecipeTypeHandler = (event: CustomEvent) => {
		const selectedRecipeType = event.detail.value;
		setChosenRecipeType(selectedRecipeType);
	};

	const insertHandler = async () => {
		const fileName = new Date().getTime() + ".jpeg";
		const storageRef = ref(storage, fileName);

		const base64 = await base64FromPath(takenPhoto!.preview);
		const base64Res = await fetch(base64);
		const photoBlob = await base64Res.blob();

		uploadBytes(storageRef, photoBlob).then(() => {
			console.log("Upload file success!");

			getDownloadURL(ref(storage, fileName)).then((url) => {
				addRecipeHandler(url);
			});
		});
	};

	const addRecipeHandler = async (url: string) => {
		try {
			const docRef = await addDoc(collection(db, "recipes"), {
				uemail: auth.currentUser?.email,
				title: titleRef.current?.value,
				description: descRef.current?.value,
				ingredients: encodeURI(ingRef.current?.value as string),
				steps: encodeURI(stepsRef.current?.value as string),
				type: chosenRecipeType,
				photoUrl: url,
				avgRating: -1
			});

			console.log("Document written with ID: ", docRef.id);
			history.push('/mainmenu');
		}
		catch (e) {
			console.error("Error adding document: ", e);
		}
	}

	const takeCameraHandler = async () => {
		try {
			const photo = await Camera.getPhoto({
				resultType: CameraResultType.Uri,
				source: CameraSource.Camera,
				quality: 80,
				width: 500,
			});

			if (!photo.path && photo.webPath) {
				photo.path = photo.webPath;
			}

			if (!photo || !photo.path || !photo.webPath) return;


			setTakenPhoto({
				path: photo.path,
				preview: photo.webPath,
			});

			setIsPhotoTaken(true);

			console.log(takenPhoto?.preview);
		} catch (e) {
			console.error(e);
		}
	};



	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref='/MainMenu'></IonBackButton>
					</IonButtons>
					<IonButtons slot='end'>
						<IonButton routerLink='/MainMenu'>
							<IonIcon icon={home} slot='icon-only'></IonIcon>
						</IonButton>
						<IonButton routerLink='/Profile'>
							<IonIcon icon={personCircle} slot='icon-only'></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<div className='postrecipe-vertical-center'>
					<div className='center'>
						<IonImg
							className='ion-align-self-end logoBlue'
							src='assets/Logo/logoBlue.png'
						/>
					</div>
				</div>

				<div className='width80'>
					<IonText color='medium' class='ion-text-center full-width'>
						<div className='postrecipe-divider-line'>
							<span className='divider-line-title'>Unggah Resep</span>
						</div>
					</IonText>
				</div>
				<IonGrid className='width90'>
					<IonRow className="ion-text-center ion-margin-top">
						<IonCol>
							<div className="image-preview" onClick={takeCameraHandler}>
								{!isPhotoTaken && <p><IonIcon size='large' color='primary' slot="start" icon={image} /></p>}
								{isPhotoTaken && <img src={takenPhoto?.preview}
								/>}
							</div>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Judul Resep</IonLabel>
							</IonRow>
							<IonRow>
								<IonInput ref={titleRef} class="input-postrecipe" placeholder='Isi judul resep di sini...'></IonInput>
							</IonRow>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Deskripsi</IonLabel>
							</IonRow>
							<IonRow>
								<IonTextarea ref={descRef} rows={3} class="input-postrecipe" placeholder='Isi deskripsi resep di sini...'></IonTextarea>
							</IonRow>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Alat dan Bahan</IonLabel>
							</IonRow>
							<IonRow>
								<IonTextarea ref={ingRef} rows={4} class="input-postrecipe" placeholder='Isi alat dan bahan dari resep di sini...'></IonTextarea>
							</IonRow>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Cara Memasak</IonLabel>
							</IonRow>
							<IonRow>
								<IonTextarea ref={stepsRef} rows={6} class="input-postrecipe" placeholder='Isi cara memasak resep di sini...'></IonTextarea>
							</IonRow>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol>
							<IonRow>
								<IonLabel color='primary'>Kategori</IonLabel>
							</IonRow>
							<IonRow>
								<IonSelect class='input-postrecipe' onIonChange={selectRecipeTypeHandler} value={chosenRecipeType}>
									<IonSelectOption value="Makanan Pembuka">Makanan Pembuka</IonSelectOption>
									<IonSelectOption value="Makanan Utama">Makanan Utama</IonSelectOption>
									<IonSelectOption value="Makanan Penutup">Makanan Penutup</IonSelectOption>
									<IonSelectOption value="Camilan">Camilan</IonSelectOption>
									<IonSelectOption value="Minuman">Minuman</IonSelectOption>
								</IonSelect>
							</IonRow>
						</IonCol>
					</IonRow>

					<IonRow className='ion-padding-top'>
						<IonCol class='ion-text-center'>
							<IonButton
								color='primary'
								className='postrecipeButtons'
								onClick={insertHandler}
							>
								<IonLabel>UNGGAH</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol class='ion-text-center'>
							<IonButton color='secondary' className='postrecipeButtons' href='/mainmenu'>
								<IonLabel>BATAL</IonLabel>
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default PostRecipe;
