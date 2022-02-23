import { IonBackButton, IonButton, IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItemDivider, IonLabel, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { searchOutline, searchSharp } from 'ionicons/icons';
import { NavButtons } from '../components/NavButtons';
import './Home.css';
import './Search.tsx';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
						<NavButtons/>
					</IonButtons>
          <IonButton slot='end' color='light'>
						<IonBackButton defaultHref='Search' color='dark' text='Search' icon=''></IonBackButton>
						<IonIcon ios={searchOutline} md={searchSharp}></IonIcon>
					</IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard>
          <IonImg className="home-img" src='assets/resources/home_img.png'></IonImg>
          <div className="card-title">
            <div>Get your Joule. </div>
            <div>Be happy.</div>
             <div className='explore'>Explore</div>
          </div>
        </IonCard>

        <IonGrid>
          <IonRow>
            <p>
              <span>Search by Type</span>
            </p>
          </IonRow>

          <IonRow class="ion-text-center">
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Beef.jpg'></IonImg>
              <IonLabel className="type-text">Beef</IonLabel>
            </IonCol>
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Seafood.jpg'></IonImg>
              <IonLabel className="type-text">Seafood</IonLabel>
            </IonCol>
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Poultry.jpg'></IonImg>
              <IonLabel className="type-text">Poultry</IonLabel>
            </IonCol>
          </IonRow>

          <IonRow class="ion-text-center">
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Pork.jpg'></IonImg>
              <IonLabel className="type-text">Pork</IonLabel>
            </IonCol>
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Lamb.jpg'></IonImg>
              <IonLabel className="type-text">Lamb</IonLabel>
            </IonCol>
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Game.jpg'></IonImg>
              <IonLabel className="type-text">Game</IonLabel>
            </IonCol>
          </IonRow>

          <IonRow class="ion-text-center">
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Vegetables.jpg'></IonImg>
              <IonLabel className="type-text">Vegetables</IonLabel>
            </IonCol>
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Dessert.jpg'></IonImg>
              <IonLabel className="type-text">Dessert</IonLabel>
            </IonCol>
            <IonCol size='4'>
              <IonImg className="type-img" src='assets/resources/type_img/Other.jpg'></IonImg>
              <IonLabel className="type-text">Other</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <p>
              <span>Cooking Guides</span>
            </p>
          </IonRow>
          <IonCard>
            <IonRow>
              <IonCol>
                <IonImg src='assets/resources/guide_img/guide01.png'/>
              </IonCol>
              <IonCol  className="guide-text">
                <IonLabel>Get Started: Basic Guide</IonLabel>
              </IonCol>
            </IonRow>
          </IonCard>
          <IonCard>
            <IonRow>
              <IonCol>
                <IonImg src='assets/resources/guide_img/guide02.png'/>
              </IonCol>
              <IonCol  className="guide-text">
                <IonLabel>Quick & Easy</IonLabel>
              </IonCol>
            </IonRow>
          </IonCard>
          <IonCard>
            <IonRow>
              <IonCol className="guide-img">
                <IonImg src='assets/resources/guide_img/guide03.png'/>
              </IonCol>
              <IonCol className='guide-text'>
                <IonLabel>Cook in a Jar - No Bag Required!</IonLabel>
              </IonCol>
            </IonRow>
          </IonCard>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
