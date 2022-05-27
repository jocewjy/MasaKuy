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
  IonText,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  book,
  call,
  home,
  image,
  informationCircleSharp,
  logOut,
  mailOutline,
  personCircle,
} from "ionicons/icons";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { getAuth, signOut } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

import "./Profile.css";
import app from "../FirebaseConfig";

const Profile: React.FC = () => {
  const auth = getAuth();
  const [toastMessage, setToastMessage] = useState("");
  const [uid, setUid] = useState("");
  const [username, setUsername] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState("");
  const history = useHistory();
  const db = getFirestore();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const storage = getStorage(app);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [fileName, setFileName] = useState<string>("");
  const [takenPhoto, setTakenPhoto] = useState<{
    path: string | undefined; // will store original URL
    preview: string; // will store preview URL for web
  }>();

  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isChangedProfilePict, setIsChangedProfilePict] =
    useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const onClickUpdate = (url: string) => {
    const user = doc(db, "user", uid);

    updateDoc(user, {
      username: username,
      phonenumber: phonenumber,
      foto: fileName,
      fotoUrl: url,
    });
    setToastMessage("Update data success");
    history.replace("/mainmenu");
  };

  const onClickUpdateNoImg = () => {
    const user = doc(db, "user", uid);

    updateDoc(user, {
      username: username,
      phonenumber: phonenumber,
    });
    setToastMessage("Update data success");
    history.replace("/mainmenu");
  };

  const getData = async () => {
    const user = collection(db, "user");
    const q = query(user, where("email", "==", auth.currentUser?.email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUid(doc.id);
      setUsername(doc.data().username);
      setEmail(doc.data().email);
      setPhonenumber(doc.data().phonenumber);
      setFoto(doc.data().fotoUrl);
    });
  };

  const onClickDiscard = () => {
    getData();
    setToastMessage("Discard changes");
    setIsChanged(false);
    setIsChangedProfilePict(false);
  };

  const onClickSignOut = () => {
    signOut(auth)
      .then(() => {
        //Sign Out Success
        setToastMessage("Signed out successfully");
        history.go(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const insertHandler = async () => {
    if (!isChangedProfilePict) {
      onClickUpdateNoImg();
    } else {
      const fileName = new Date().getTime() + ".jpeg";
      const base64 = await base64FromPath(takenPhoto!.preview);
      const base64Res = await fetch(base64);
      const photoBlob = await base64Res.blob();


      const storageRef = ref(storage, fileName);

      uploadBytes(storageRef, photoBlob).then(() => {
        console.log("Upload file success!");

        getDownloadURL(ref(storage, fileName)).then((url) => {
          onClickUpdate(url);
        });
      });
    }
  };

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

	  setIsChanged(true);
      setIsChangedProfilePict(true);
	  
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/MainMenu"></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton href="/aboutus">
              <IonIcon
                icon={informationCircleSharp}
                slot="icon-only"
                size="large"
              ></IonIcon>
            </IonButton>
            <IonButton href="/MainMenu">
              <IonIcon icon={home} slot="icon-only" size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="profile-vertical-center">
          <div className="wrapper">
            {!takenPhoto ? (
              foto ? (
                <IonImg className="ion-align-self-end profilePict" src={foto} />
              ) : (
                <p className="nophoto">Tidak ada foto profil terpasang.</p>
              )
            ) : isChangedProfilePict ? (
              <img
                className="profilePict"
                // src={URL.createObjectURL(selectedFile)}
				src={takenPhoto?.preview}
              />
            ) : (
              <IonImg className="ion-align-self-end profilePict" src={foto} />
            )}

            {/* <input
              type="file"
              onChange={fileChangeHandler}
              accept="image/*"
              className="file"
              ref={inputFileRef}
            /> */}
          </div>

          <IonButton
            class="newPhotoBtn"
            color="secondary"
            onClick={takeCameraHandler}
          >
            <IonIcon icon={image} size="large" />
          </IonButton>
        </div>

        <div className="width80">
          <IonText color="medium" class="ion-text-center full-width">
            <div className="profile-divider-line">
              <span className="divider-line-title">P R O F I L</span>
            </div>
          </IonText>
        </div>

        <IonGrid className="width80">
          <IonRow className="inputProfile">
            <IonCol size="3" className="ion-text-center">
              <IonIcon icon={personCircle} size="large"></IonIcon>
            </IonCol>
            <IonCol>
              <IonInput
                onIonChange={(e: any) => setUsername(e.target.value)}
                onIonInput={(e: any) => (
                  setUsername(e.target.value), setIsChanged(true)
                )}
                value={username}
                className="transparent input-profile-value"
              ></IonInput>
            </IonCol>
          </IonRow>

          <IonRow className="inputProfile">
            <IonCol size="3" className="ion-text-center">
              <IonIcon icon={call} size="large"></IonIcon>
            </IonCol>
            <IonCol>
              <IonInput
                onIonChange={(e: any) => setPhonenumber(e.target.value)}
                onIonInput={(e: any) => (
                  setPhonenumber(e.target.value), setIsChanged(true)
                )}
                type="number"
                value={phonenumber}
                className="transparent input-profile-value"
              ></IonInput>
            </IonCol>
          </IonRow>

          <IonRow className="inputProfile  input-disabled">
            <IonCol size="3" className="ion-text-center">
              <IonIcon icon={mailOutline} size="large"></IonIcon>
            </IonCol>
            <IonCol>
              <IonInput
                value={email}
                className="transparent input-profile-value"
                readonly
              ></IonInput>
            </IonCol>
          </IonRow>

          <IonRow className="ion-padding-top">
            <IonCol class="ion-text-center">
              {isChanged === true ? (
                <IonButton
                  onClick={insertHandler}
                  color="primary"
                  className="profileButton"
                >
                  <IonLabel>SIMPAN PERUBAHAN</IonLabel>
                </IonButton>
              ) : (
                <IonButton
                  onClick={insertHandler}
                  color="primary"
                  className="profileButton"
                  disabled
                >
                  <IonLabel>SIMPAN PERUBAHAN</IonLabel>
                </IonButton>
              )}
            </IonCol>
          </IonRow>

          <IonRow class="ion-padding-bottom">
            <IonCol class="ion-text-center">
              {isChanged === true ? (
                <IonButton
                  onClick={onClickDiscard}
                  color="secondary"
                  className="profileButton"
                >
                  <IonLabel>HAPUS PERUBAHAN</IonLabel>
                </IonButton>
              ) : (
                <IonButton
                  onClick={onClickDiscard}
                  color="secondary"
                  className="profileButton"
                  disabled
                >
                  <IonLabel>HAPUS PERUBAHAN</IonLabel>
                </IonButton>
              )}
            </IonCol>
          </IonRow>

          <IonRow class="ion-padding-top">
            <IonCol class="ion-text-center">
              <IonButton
                fill="outline"
                routerLink="/mypost"
                className="profileButton"
                color="primary"
              >
                <IonIcon icon={book} slot="start" />
                <IonLabel>LIHAT RESEPKU</IonLabel>
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow class="ion-padding-bottom">
            <IonCol class="ion-text-center">
              <IonButton
                fill="outline"
                routerLink="/home"
                className="profileButton"
                onClick={onClickSignOut}
                color="secondary"
              >
                <IonIcon icon={logOut} slot="start" />
                <IonLabel>KELUAR</IonLabel>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => {
            setToastMessage("");
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
