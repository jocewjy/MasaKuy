import {
	IonBackButton,
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
	IonLabel,
	IonPage,
	IonRow,
	IonSearchbar,
	IonText,
	IonTextarea,
	IonTitle,
	IonToast,
	IonToolbar,
} from '@ionic/react';
import { add, home, personCircle, send } from 'ionicons/icons';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
	collection,
	getFirestore,
	getDocs,
	doc,
	getDoc,
	query,
	where,
	addDoc,
} from 'firebase/firestore';

import './CommentRecipe.css';
import { useHistory, useParams } from 'react-router';
import { getAuth } from 'firebase/auth';

const CommentRecipe: React.FC = () => {
	const auth = getAuth();
	const db = getFirestore();
	const history = useHistory();
	const [toastMessage, setToastMessage] = useState('');

	//User Data
	const [foto, setFoto] = useState('');
	const [author, setAuthor] = useState('');
	//Recipe UID
	const rId = useParams<{ rId: string }>().rId;
	const [title, setTitle] = useState('');
	//Comment
	const comment = useRef<HTMLIonTextareaElement>(null);

	const [comments, setComments] = useState<Array<any>>([]);
	const [users, setUsers] = useState<Array<any>>([]);

	useEffect(() => {
		getData();
		getComment();
	}, [users]);

	useEffect(() => {
		async function getUserData() {
			const querySnapshotUser = await getDocs(collection(db, 'user'));

			console.log('querySnapshotUser: ', querySnapshotUser);

			setUsers(
				querySnapshotUser.docs.map(doc => ({
					...doc.data(),
					id: doc.id,
				}))
			);

			querySnapshotUser.forEach(doc => {
				console.log(`${doc.id} => ${doc.data()}`);
				console.log('doc: ', doc);
			});
		}

		getUserData();
	}, []);

	const getData = async () => {
		//Get Session User Data
		const user = collection(db, 'user');
		const q = query(user, where('email', '==', auth.currentUser?.email));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach(doc => {
			// doc.data() is never undefined for query doc snapshots
			setFoto(doc.data().fotoUrl);
			setAuthor(doc.data().username);
		});

		//Get Current Recipe Data
		const recipes = doc(db, 'recipes', rId);
		const docSnap = await getDoc(recipes);
		if (docSnap.exists()) {
			setTitle(docSnap.data().title);
		} else {
			// doc.data() will be undefined in this case
			console.log('No such document!');
		}
	};

	const getComment = async () => {
		const comments = collection(db, 'comments');
		const q = query(comments, where('id', '==', rId));

		const querySnapshot = await getDocs(q);
		setComments(
			querySnapshot.docs.map(doc => ({
				...doc.data(),
				id: doc.id,
				uname: users[users.findIndex(u => u.email === doc.data().email)].username,
				profilePict: users[
					users.findIndex(u => u.email === doc.data().email)
				].fotoUrl,
			}))
		);
	};

	const postComment = async () => {
		if (comment.current?.value === '') {
			return setToastMessage('Comment tidak boleh kosong');
		}

		try {
			const docRef = await addDoc(collection(db, 'comments'), {
				email: auth.currentUser?.email,
				fotoUrl: foto,
				comment: comment.current?.value,
				id: rId,
			});
			console.log('Document written with ID: ', docRef.id);
			history.go(0);
		} catch (e) {
			console.error('Error adding document: ', e);
		}
	};

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
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref={`/post/${rId}`}></IonBackButton>
					</IonButtons>
					<IonButtons slot='end'>
						<IonButton routerLink='/mainmenu'>
							<IonIcon icon={home} slot='icon-only'></IonIcon>
						</IonButton>
						<IonButton routerLink='/profile'>
							<IonIcon icon={personCircle} slot='icon-only'></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonContent fullscreen>
					<div className='comment-vertical-center width90'>
						<h1 className='title-comment'>{title}</h1>
					</div>

					<div className='width80 ion-padding-bottom'>
						<IonText color='medium' class='ion-text-center full-width'>
							<div className='comment-divider-line'>
								<span className='divider-line-title'>Comments</span>
							</div>
						</IonText>
					</div>

					<IonGrid className='width90 ion-padding-top'>
						<IonRow>
							<IonCol size='1' class='commentAuthPicWidth'>
								<IonImg className='commentProfile' src={foto} />
							</IonCol>

							<IonCol class='commentAuthNameWidth'>
								<p className='commentAuthProf one-line'>{author}</p>
							</IonCol>
						</IonRow>

						<IonRow>
							<IonCol>
								<IonRow>
									<IonTextarea
										rows={6}
										ref={comment}
										class='input-comment'
										placeholder='Isi komentar di sini...'
									></IonTextarea>
								</IonRow>
							</IonCol>
						</IonRow>
						
						<IonRow class='ion-padding-bottom'>
							<IonButton color='primary' className='comment-btn' onClick={postComment}>
								<IonIcon icon={send} slot='start'></IonIcon>
								Kirim Komentar
							</IonButton>
						</IonRow>

						{(!comments || comments.length <= 0) && (
							<IonRow className='ion-padding'>
								<IonCol className='ion-text-center'>
									<IonTitle color='primary'>Belum ada komentar.</IonTitle>
								</IonCol>
							</IonRow>
						)}

						{comments &&
							comments.map(comment => (
								<>
									<div className='comment-divider-line'></div>

									<IonRow>
										<IonCol size='2' class='ion-no-padding commentProfileMargin'>
											<IonImg
												className='commentProfile'
												src={comment.profilePict}
											/>
										</IonCol>

										<IonCol class='commentText ion-no-padding topBottomAuto'>
											<p className='comment-name one-line'>{comment.uname}</p>
										</IonCol>
									</IonRow>

									<IonRow>
										<IonCol size='2'>
										</IonCol>

										<IonCol class='commentText ion-no-padding'>
											<p className='comment-orang'>{comment.comment}</p>
										</IonCol>
									</IonRow>

									<div className='comment-divider-line-last'></div>
								</>
							))}
					</IonGrid>
				</IonContent>
			</IonContent>
		</IonPage>
	);
};

export default CommentRecipe;
