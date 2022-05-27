import {
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonPage,
	IonRow,
	IonSearchbar,
	IonSelect,
	IonSelectOption,
	IonText,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import {
    home,
	person,
	personCircle, pricetag, star,
} from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';

import { collection, getFirestore, getDocs, query, where} from "firebase/firestore";

import './MyPost.css';
import { useHistory } from 'react-router';
import { getAuth } from 'firebase/auth';

const MyPost: React.FC = () => {
    const auth = getAuth();
    
	const [searchText, setSearchText] = useState('');

	const db = getFirestore();

	const history = useHistory();

	const cancelSearchHandler = () => {
		history.replace('/profile');
	}

	const searchbarRef = useRef<HTMLIonSearchbarElement>(null);

	useEffect(() => {
		searchbarRef.current?.setFocus();
	}, []);

	const [chosenRecipeType, setChosenRecipeType] = useState<'Semua Kategori' | 'Makanan Pembuka' | 'Makanan Utama' | 'Makanan Penutup' | 'Camilan' | 'Minuman'>('Semua Kategori');

	const selectRecipeTypeHandler = (event: CustomEvent) => {
        const selectedRecipeType = event.detail.value;
        setChosenRecipeType(selectedRecipeType);
    };

	const [chosenRating, setChosenRating] = useState<-1 | 1 | 2 | 3 | 4 | 5>(-1);

	const selectRatingHandler = (event: CustomEvent) => {
        const selectedRating = event.detail.value;
        setChosenRating(selectedRating);
    };

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
        async function getData(){
            const querySnapshot = await getDocs(
				chosenRecipeType === "Semua Kategori"?
					query(
						collection(db, "recipes"),
                        where("uemail", "==", auth.currentUser?.email)
					)
				:
					query(
						collection(db, "recipes"),
						where("type", "==", chosenRecipeType),
                        where("uemail", "==", auth.currentUser?.email)
					)
			);

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
    }, [users, chosenRecipeType, searchText, chosenRating]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonSearchbar
						ref={searchbarRef}
						onIonChange={e => setSearchText(e.detail.value!)}
						placeholder='Cari resep...'
						showCancelButton="always"
						onIonCancel={cancelSearchHandler}
						color="tertiary"
					></IonSearchbar>

					<IonButtons slot='end'>
						<IonButton routerLink='/mainmenu'>
							<IonIcon icon={home} slot='icon-only'></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonGrid class='width90'>
					<IonRow>
						<IonSelect class='input-searchrecipe' onIonChange={selectRecipeTypeHandler} value={chosenRecipeType}>
							<IonSelectOption value="Semua Kategori">Semua Kategori</IonSelectOption>
							<IonSelectOption value="Makanan Pembuka">Makanan Pembuka</IonSelectOption>
							<IonSelectOption value="Makanan Utama">Makanan Utama</IonSelectOption>
							<IonSelectOption value="Makanan Penutup">Makanan Penutup</IonSelectOption>
							<IonSelectOption value="Camilan">Camilan</IonSelectOption>
							<IonSelectOption value="Minuman">Minuman</IonSelectOption>
						</IonSelect>
					</IonRow>

					<IonRow class='ion-padding-bottom'>
						<IonSelect class='input-searchrecipe' onIonChange={selectRatingHandler} value={chosenRating}>
							<IonSelectOption value={-1}>Semua Penilaian</IonSelectOption>
							<IonSelectOption value={1}>Penilaian &#9733;1</IonSelectOption>
							<IonSelectOption value={2}>Penilaian &#9733;2</IonSelectOption>
							<IonSelectOption value={3}>Penilaian &#9733;3</IonSelectOption>
							<IonSelectOption value={4}>Penilaian &#9733;4</IonSelectOption>
							<IonSelectOption value={5}>Penilaian &#9733;5</IonSelectOption>
						</IonSelect>
					</IonRow>

                    <div className="width80">
                        <IonText color="medium" class="ion-text-center full-width">
                            <div className="mypost-divider-line">
                                <span className="divider-line-title">Resepku</span>
                            </div>
                        </IonText>
				    </div>

					{(!recipes || recipes.length <= 0) && (
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <IonTitle color="primary">Tidak ada resep ditemukan.</IonTitle>
                            </IonCol>
                        </IonRow>
                    )}

					{recipes && recipes.map(recipe => (
						(recipe.title.toLowerCase().includes(searchText.toLowerCase()) && recipe.avgRating >= chosenRating)?
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
										<br/>
										
										<p className='one-line'>
											<small>
												<IonIcon icon={person} slot='start'/> &nbsp;
												{recipe.uname}
											</small>
										</p>
										
										<p className='one-line'>
											<small>
												<IonIcon icon={pricetag} slot='start'/> &nbsp;
												{recipe.type}
											</small>
										</p>

										<p className='one-line'>
											<small>
												<IonIcon icon={star} slot='start'/> &nbsp;
												{recipe.avgRating == -1?
													<>Belum dinilai</>
												:
													<>{recipe.avgRating.toFixed(1)}</>
												}
											</small>
										</p>
									</IonCol>
								</IonButton>
							</IonRow>
						:
							<></>
					))}
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default MyPost;