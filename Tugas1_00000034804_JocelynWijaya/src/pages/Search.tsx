import { IonBackButton, IonButton, IonCard, IonCol, IonContent, IonHeader, IonLabel, IonPage, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonToolbar } from "@ionic/react"
import './Search.css';
import './Home.css';
import { search } from "ionicons/icons";

const Search: React.FC = ()=> {
    return(
        <IonPage>
			<IonHeader>
				<IonToolbar>
                    <IonButton slot="end" color="light">
                        <IonBackButton defaultHref="home" text="Cancel" icon=''/>
                    </IonButton>
					<IonSearchbar></IonSearchbar>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonSegment>
					<IonSegmentButton>All</IonSegmentButton>
					<IonSegmentButton>Joule App</IonSegmentButton>
					<IonSegmentButton>ChefSteps.com</IonSegmentButton>
				</IonSegment>
				<IonContent>
					<div className='sub'>Visual Doneness Guides</div> 
					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Food</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>

					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Meat</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>

					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Shrimp</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>

					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Shrimp</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>

					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Shrimp</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>

					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Shrimp</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>

					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Shrimp</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>

					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Shrimp</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>

					<IonCard>
						<IonRow>
							<IonCol>
								<img src='assets/resources/home_img.png' className='food' />
							</IonCol>
							<IonCol>
								<h4>Ultimate Shrimp</h4>
								<h6>VISUAL DONENESS GUIDES</h6>
							</IonCol>
						</IonRow>
					</IonCard>
				</IonContent>
			</IonContent>
		</IonPage>
    )
};

export default Search;