import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonContent, IonImg, IonText, IonTitle, IonRow, IonCol, IonGrid } from "@ionic/react";
import { home, personCircle } from "ionicons/icons";

import './AboutUs.css';

const AboutUs: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/profile'></IonBackButton>
                    </IonButtons>

                    <IonButtons slot='end'>
                        <IonButton routerLink='/mainmenu'>
                            <IonIcon icon={home} slot='icon-only'></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className='width80'>
                    <IonText color='medium' class='ion-text-center full-width'>
                        <div className='aboutus-divider-line'>
                            <span className='divider-line-title'>About Us</span>
                        </div>
                    </IonText>

                    <IonImg src="assets/Logo/logoPrimary.png" className='aboutus-imglogo'></IonImg>
                    <IonTitle color='primary' className='ion-text-center aboutus-title'>by Argati</IonTitle>

                    <IonTitle color='primary' className='ion-text-center aboutus-title2'>Anggota Kami</IonTitle>
                    <div className='aboutus-divider-line2'></div>
                </div>
                <IonGrid className="width80">
                    <IonRow>
                        <IonCol className='aboutus-grid'>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>Christian Liyanto</IonTitle>
                            </IonRow>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>00000033739</IonTitle>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className='aboutus-grid'>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>Elaine</IonTitle>
                            </IonRow>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>00000034171</IonTitle>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className='aboutus-grid'>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>Ferry</IonTitle>
                            </IonRow>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>00000034436</IonTitle>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className='aboutus-grid'>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>Hadi Sasmita Wijaya</IonTitle>
                            </IonRow>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>00000034659</IonTitle>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className='aboutus-grid'>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>Jocelyn Wijaya</IonTitle>
                            </IonRow>
                            <IonRow className='aboutus-text'>
                                <IonTitle className='ion-text-center'>00000034804</IonTitle>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                </IonGrid>

            </IonContent>
        </IonPage>
    );
}

export default AboutUs;